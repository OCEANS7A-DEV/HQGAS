import React, { useEffect, useState } from 'react';
import { kaigisituOrder } from '../backend/Server_end.ts';
import '../css/taiyoPrint.css';


interface SettingProps {
  setCurrentPage: (page: string) => void;
  printData: any;
  dataPages: number;
}


export default function TaiyoPrint({ setCurrentPage, printData, dataPages }: SettingProps) {
  const [taiyoData, settaiyoData] = useState([]);
  const [ShippingAddress, setShippingAddress] = useState([]);
  const [VendorData, setVendorData] = useState([]);
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));


  const HonbuSet = async() => {
    let insertData = await JSON.parse(sessionStorage.getItem('shortageSet') ?? '');
    let returndata = []
    await sleep(500)
    if (insertData){
      for (let i = 0; i < insertData.length; i++){
        let shortageNum = Number(insertData[i][12]);
        let num = 0;
        if (insertData[i][11] !== "" && Number(insertData[i][11]) > 0) {
          while (shortageNum < 0) {
            shortageNum += Number(insertData[i][11])
            num += Number(insertData[i][11])
          }
          returndata.push(['', insertData[i][2], num, '', '', ''])
        } else {
          returndata.push(['', insertData[i][2], -(Number(insertData[i][12])), '', '', ''])
        }
        
      }
    }
    let calcD = 16 - returndata.length
    for (let i = 0; i < calcD; i ++){
      returndata.push(['','','','','',''])
    }
    settaiyoData(returndata)
  }

  const KaigisituSet = async() => {
    const productdata = JSON.parse(localStorage.getItem('data'));
    let returndata = []
    const data = await kaigisituOrder();
    const filter = data.filter(row => row[2] == '大洋商会' || row[2] == '大洋')
    for (let i = 0; i < data.length; i++){
      let matchdata = productdata.filter(row => row[1] == filter[i][3])
      let count = 0;
      let num = 0;
      while (num < filter[i][6]) {
        count++
        num += matchdata[0][11] + matchdata[0][10]
      }
      let serviceNum = count * matchdata[0][10]
      returndata.push(['', filter[i][4], num - serviceNum, '', '', ''])
    }
    let calcD = 16 - returndata.length
    for (let i = 0; i < calcD; i ++){
      returndata.push(['','','','','',''])
    }
    settaiyoData(returndata)
  }

  useEffect(() => {
    const vendordata = JSON.parse(sessionStorage.getItem('EtcData') ?? '');
    const Address = vendordata.find(row => row[0] == sessionStorage.getItem('AddressSet'))
    setVendorData(vendordata.find(row => row[0] == '大洋商会'))
    setShippingAddress(Address)
    if (Address[0] !== '会議室'){
      HonbuSet()
    } else {
      KaigisituSet()
    }
  },[])

  useEffect(() => {
    console.log(taiyoData)
    if(taiyoData.length >= 1){
      const Print = async () => {
        await new Promise<void>((resolve) => {
          const onAfterPrint = () => {
            window.removeEventListener('afterprint', onAfterPrint);
            resolve();
          };
          window.addEventListener('afterprint', onAfterPrint);
          window.print();
        });
      }
      Print();
      const pageReturn = async () => {
        setCurrentPage('HQPage')
      }
      pageReturn()
    }
    
    
  },[taiyoData])
  
  return(
    <div className="taiyobackGround">
      <div className="taiyotop">
        <h1 className="taiyoH1">FAX注文書</h1>
      </div>
      <div className="sub_top">
        <div className="sub_top2">
          <h2 className="taiyo-Data">　</h2>
          <h2 className="taiyo-Data-name">㈱大洋商会　御中</h2>
        </div>
        <div className="sub_top2">
          <h2 className="taiyo-Data-number">FAX{VendorData[2]}</h2>
          <h2 className="taiyo-Data-number">TAL{VendorData[3]}</h2>
        </div>
      </div>
      <div className="taiyo-tableArea">
        <table className="taiyo-table">
          <thead>
            <tr className="taiyo-table-header">
              <th className="taiyo-number">カタログ<br/>掲載番号</th>
              <th className="taiyo-name">商品名</th>
              <th className="taiyo-num">数量</th>
              <th className="taiyo-Dnum">ディーラー<br/>価格</th>
              <th className="taiyo-Snum">サロン価格</th>
              <th className="taiyo-bikou">備考</th>
            </tr>
          </thead>
          <tbody>
            {taiyoData.map((row, index) => (
              <tr key={index}>
                <td className="taiyo-number-data">{row[0]}</td>
                <td className="taiyo-name-data">{row[1]}</td>
                <td className="taiyo-num-data">{row[2]}</td>
                <td className="etc"></td>
                <td className="etc"></td>
                <td className="etc"></td>
              </tr>
            ))}
            <>
              <tr className="taiyo-saron-last">
                <td colSpan="6" className="special-row-saron">
                  <h2 className="sarontop">サロン直送</h2>
                  <div className="taiyo-saron-table">
                    <tr className="saronname">
                      <td className="sarontitle">サロン名</td>
                      <td className="saronData">{ShippingAddress[6]}</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">配送先</td>
                      <td className="saronData">〒{ShippingAddress[4]}　{ShippingAddress[5]}</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">電話</td>
                      <td className="saronData">082-569-8401</td>
                    </tr>
                  </div>
                </td>
              </tr>
              <tr className="taiyo-saron-message">
                <td colSpan="6" className="special-row">
                  <h3 className="sarontop">お世話になります。<br/>ご注文よろしくお願いします</h3>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </div>
  )
};



