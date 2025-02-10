import React, { useEffect, useState } from 'react';
import { kaigisituOrder } from '../backend/Server_end.ts';
import '../css/taiyoPrint.css';


interface SettingProps {
  setCurrentPage: (page: string) => void;
  printData: any;
  dataPages: number;
}

const testData = [
  ['2025-01-08T15:00:00.000Z', '会議室', '大洋商会', 2001, 'ｱﾝﾍｱｶﾗｰｴﾙ23E　赤箱', '', 720, '', 505, 30300, '', '', '未印刷', 'OCEAN_HQ_ID', '2025-02-04T23:21:02.000Z'],
  ['2025-01-08T15:00:00.000Z', '会議室', '大洋商会', 2002, 'ｱﾝﾍｱｶﾗｰｴﾙ25E　赤箱', '', 240, '', 505, 121200, '', '', '未印刷', 'OCEAN_HQ_ID', '2025-02-04T23:21:02.000Z'],
  ['2025-01-08T15:00:00.000Z', '会議室', '大洋商会', 2003, 'ｱﾝﾍｱｶﾗｰｴﾙ30E　赤箱', '', 120, '', 505, 60600, '', '', '未印刷', 'OCEAN_HQ_ID', '2025-02-04T23:21:02.000Z']
]


export default function TaiyoPrint({ setCurrentPage, printData, dataPages }: SettingProps) {
  const [taiyoData, settaiyoData] = useState([]);
  const [ShippingAddress, setShippingAddress] = useState([]);
  const [VendorData, setVendorData] = useState([]);


  const HonbuSet = (vendordata) => {
    setVendorData(vendordata.find(row => row[0] == '大洋商会'))
    setShippingAddress(vendordata.find(row => row[0] == sessionStorage.getItem('AddressSet')))
    let insertData = sessionStorage.getItem('shortageSet');
    let returndata = []
    if (insertData){
      insertData = JSON.parse(insertData)
      
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
    //const data = testData
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
      // console.log(count)
      // console.log(matchdata[0][10])
      returndata.push(['', filter[i][4], num - serviceNum, '', '', ''])
    }
    let calcD = 16 - returndata.length
    for (let i = 0; i < calcD; i ++){
      returndata.push(['','','','','',''])
    }
    //console.log(returndata)
    settaiyoData(returndata)
  }

  useEffect(() => {
    const vendordata = JSON.parse(sessionStorage.getItem('EtcData') ?? '');
    const Address = vendordata.find(row => row[0] == sessionStorage.getItem('AddressSet'))

    setShippingAddress(Address)
    //console.log(vendordata)
    //console.log(Address[0])

    if (Address[0] !== '会議室'){
      HonbuSet(vendordata)
    } else {
      KaigisituSet()
    }
    
    
  },[])

  useEffect(() => {
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
    return
    
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



