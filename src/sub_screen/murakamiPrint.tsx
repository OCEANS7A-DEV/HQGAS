import React, { useState, useEffect } from 'react';
import '../css/kinbatoPrint.css';
import '../css/taiyoPrint.css';
import { murakamiOrder } from '../backend/Server_end.ts';


interface SettingProps {
  setCurrentPage: (page: string) => void;
}


const getMonthString = () => {
  var date = new Date();         // 現在日時を生成
  var yyyy = date.getFullYear(); // 西暦を取得
  var mm = date.getMonth() + 1;  // 月を取得（返り値は実際の月-1なので、+1する）
  var dd = date.getDate(); // 日を取得
  var w = date.getDay();   // 曜日を取得（数値）
   
  // 月と日が一桁の場合は先頭に0をつける
  if (mm < 10) {
      mm = "0" + mm;
  }
  if (dd < 10) {
      dd = "0" + dd;
  }
   
  // 曜日を数値から文字列に変換するための配列
  const week = ["日", "月", "火", "水", "木", "金", "土"];  
   
  var result = yyyy + " 年 " + mm + " 月 " + dd + " 日 " + "( " + week[w] + " )"; // フォーマットを整えて表示
   
  return result
}



const testData = [
  ['大洋商会', 2001, 'アン赤箱 23E', '', '', '', '[7]その他・備品', '現在本部取扱なし', '', -24, '', 55],
  ['大洋商会', 2002, 'アン赤箱 25E', '', '', '', '[7]その他・備品', '現在本部取扱なし', '', -8, '', 55]
]




export default function MurakamiPrintPage({setCurrentPage}: SettingProps) {
  const [NowDay, setNowDay] = useState('');
  const [ShippingAddress, setShippingAddress] = useState([]);
  const [MurakamiData, setMurakamiData] = useState([]);
  const [VendorData, setVendorData] = useState([]);
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const [prostepData, setProStepdata] = useState([]);
  const [storeData, setStoreData] = useState([])


  const prostepGet = async () => {
    const data = await murakamiOrder()
    setProStepdata(data)
    const storedata = [...new Set(data.map(row => row[1]))]
    setStoreData(storedata)

    console.log(storedata)
  };

  useEffect(() => {
    prostepGet()
    const Now = getMonthString();
    setNowDay(Now)
    const vendordata = JSON.parse(sessionStorage.getItem('EtcData') ?? '');
    const addressdata = sessionStorage.getItem('AddressSet') ?? '本部事務所'
    setShippingAddress(vendordata.find(row => row[0] == addressdata))
    setVendorData(vendordata.find(row => row[0] == 'ムラカミ'))
    let insertData = sessionStorage.getItem('shortageSet');
    let returndata = []
    if (insertData){
      insertData = JSON.parse(insertData)
      for (let i = 0; i < insertData.length; i++){
        let shortageNum = Number(insertData[i][11]);
        let num = 0;
        if (insertData[i][11] !== "" || Number(insertData[i][11]) > 0) {
          while (shortageNum < 0) {
            shortageNum += Number(insertData[i][11])
            num += Number(insertData[i][11])
          }
          //insertData[i][9]
        }
        returndata.push(['', insertData[i][2], -(Number(insertData[i][12])), '', '', ''])
      }
    }
    const resultdata = returndata.filter(row => !row[1].includes('ﾙﾍﾞﾙ'))
    let calcD = 22 - resultdata.length
    for (let i = 0; i < calcD; i ++){
      resultdata.push(['','','','','',''])
    }
    
    setMurakamiData(resultdata)
    //console.log(resultdata)
  }, [])


  useEffect(() => {
    
    if(MurakamiData.length >= 1){
      //console.log(MurakamiData)
      const Print = async () => {
        await sleep(500)
        await new Promise<void>((resolve) => {
          const onAfterPrint = () => {
            window.removeEventListener('afterprint', onAfterPrint);
            resolve();
          };
          window.addEventListener('afterprint', onAfterPrint);
          //window.print();
        });
      }
      Print();
      const pageReturn = async () => {
        await sleep(500)
        //setCurrentPage('HQPage')
      }
      pageReturn()
    }
  },[MurakamiData])


  return(
    <div className="PrintbackGround">
      <div className="kinbato-top">
        <h1 className="taiyoH1">
          注文書
        </h1>
        <div className="address-area">
          <div className="kinbato-left">
            <h2 className="taiyo-Data-name">株式会社　{VendorData[0]}　御中</h2>
            {/* <div className="taiyo-Data-name"><div className="kinbato-date">{NowDay}</div></div> */}
            <div className="taiyo-Data-name">TEL:{VendorData[2]}</div>
            <div className="taiyo-Data-name">FAX:{VendorData[3]}</div>
            <div className="taiyo-Data-name"><h3 className="order-message">お世話になります<br/>ご注文宜しくお願いします。</h3></div>
          </div>
          <div className="kinbato-right">
            <div className="ocean-area">
              <div>{ShippingAddress[6]}</div>
              <div>{ShippingAddress[5]}</div>
              <div>TEL {ShippingAddress[3]}</div>
              <div className="kinbato-tantou">担当</div>
              <div>FAX {ShippingAddress[3]}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="taiyo-tableArea">
        <table className="taiyo-table">
          <thead>
            <tr className="kinbato-header">
              <th className="taiyo-name-data">商品名</th>
              <th className="taiyo-num-data">個数</th>
            </tr>
          </thead>
          <tbody>
            {MurakamiData.map((row,index) => (
              <tr key={index}>
                <td className="murakami-name-data">{row[1]}</td>
                <td className="murakami-num-data">{row[2]}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="murakami-last-data">プロステップは別紙です</td>
            </tr>
          </tbody>
          <tbody>
            {storeData.map((row, index) => (
              <th key={index}>
                
              </th>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );  
}