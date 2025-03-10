import React, { useState, useEffect } from 'react';
import '../css/kinbatoPrint.css';
import '../css/taiyoPrint.css';
import { search } from '../backend/WebStorage';


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




export default function KinbatoPrintPage({setCurrentPage}: SettingProps) {
  const [NowDay, setNowDay] = useState('');
  const [ShippingAddress, setShippingAddress] = useState([]);
  const [KinbatoData, setKinbatoData] = useState([]);
  const [VendorData, setVendorData] = useState([]);
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));


  useEffect(() => {
    const Now = getMonthString();
    setNowDay(Now)
    const vendordata = JSON.parse(sessionStorage.getItem('EtcData') ?? '');
    const addressdata = sessionStorage.getItem('AddressSet') ?? '本部事務所'
    setShippingAddress(vendordata.find(row => row[0] == addressdata))
    setVendorData(vendordata.find(row => row[0] == 'キンバト'))


    let insertData = JSON.parse(sessionStorage.getItem('shortageSet') ?? '');
    let returndata = []
    if (insertData){
      const aminofil = insertData.filter(row => row[2].indexOf('ｱﾐﾉ') !== -1)
      const tiofil = insertData.filter(row => row[2].indexOf('ﾁｵﾊｰﾄﾞ') !== -1)
      const etcData = insertData.filter(row => row[2].indexOf('ｱﾐﾉ') == -1 && row[2].indexOf('ﾁｵﾊｰﾄﾞ') == -1)

      if(aminofil.length !== 0)  {
        returndata.push(['', 'アミノアシッド', 20+'本', '', '', ''])
      }
      console.log(matome(insertData, 'チオハード'))
      if(tiofil.length !== 0){
        
        returndata.push(['', 'チオハード', 20+'本', '', '', ''])
      }
      for (let i = 0; i < etcData.length; i++){
        let shortageNum = Number(etcData[i][9]);
        let num = 0;
        if (etcData[i][11] !== "" || Number(etcData[i][11]) > 0) {
          while (shortageNum < 0) {
            shortageNum += Number(etcData[i][11])
            num += Number(etcData[i][11])
          }
        }
        returndata.push(['', etcData[i][2], num, '', '', ''])
      }
    }
    let calcD = 21 - returndata.length
    for (let i = 0; i < calcD; i ++){
      returndata.push(['','','','','',''])
    }
    setKinbatoData(returndata)
  }, [])

  const matome = async (data:any, word: string) => {
    const resultc = await search(word, data)
    console.log(resultc)
    return resultc
  }

  useEffect(() => {
    if(KinbatoData.length >= 1){
      const Print = async () => {
        await sleep(500)
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
        await sleep(500)
        setCurrentPage('HQPage')
      }
      pageReturn()
    }
  },[KinbatoData])

  return(
    <div className="PrintbackGround">
      <div className="kinbato-top">
        <h1 className="taiyoH1">
          注文書
        </h1>
        <div className="address-area">
          <div className="kinbato-left">
            <h2 className="taiyo-Data-name">㈱ キンバト　御中</h2>
            <div className="taiyo-Data-name"><div className="kinbato-date">{NowDay}</div></div>
            <div className="taiyo-Data-name">FAX:{VendorData[2]}</div>
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
              <th className="taiyo-number-data">品番</th>
              <th className="taiyo-name-data">商品名(色、サイズなど)</th>
              <th className="taiyo-num-data">数量</th>
              <th className="etc">サロン価格</th>
              <th className="etc">ﾃﾞｨｰﾗｰ価格</th>
              <th className="etc">備考</th>
            </tr>
          </thead>
          <tbody>
            {KinbatoData.map((row, index) => (
              <tr key={index}>
                <td className="taiyo-number-data">{row[0]}</td>
                <td className="taiyo-name-data">{row[1]}</td>
                <td className="taiyo-num-data">{row[2]}</td>
                <td className="etc"></td>
                <td className="etc"></td>
                <td className="etc"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );  
}