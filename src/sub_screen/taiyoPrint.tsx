import React, { useEffect, useState } from 'react';

import '../css/taiyoPrint.css';


interface SettingProps {
  setCurrentPage: (page: string) => void;
  printData: any;
  dataPages: number;
}

const testData = [
  ['大洋商会', 2001, 'アン赤箱 23E', '', '', '', '[7]その他・備品', '現在本部取扱なし', '', -24, '', 55],
  ['大洋商会', 2002, 'アン赤箱 25E', '', '', '', '[7]その他・備品', '現在本部取扱なし', '', -8, '', 55]
]



export default function TaiyoPrint({ setCurrentPage, printData, dataPages }: SettingProps) {
  const [taiyoData, settaiyoData] = useState([]);
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  useEffect(() => {
    let insertData = testData
    let returndata = []
    for (let i = 0; i < insertData.length; i++){
      let shortageNum = Number(insertData[i][9]);
      let num = 0;
      if (insertData[i][11] !== "" || Number(insertData[i][11]) > 0) {
        while (shortageNum < 0) {
          shortageNum += Number(insertData[i][11])
          num += Number(insertData[i][11])
        }
        //insertData[i][9]
      }
      returndata.push(['', insertData[i][2], num, '', '', ''])
    }
    let calcD = 11 - returndata.length
    for (let i = 0; i < calcD; i ++){
      returndata.push(['','','','','',''])
    }
    settaiyoData(returndata)
    const Print = async () => {
      await sleep(500);
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
  },[])
  return(
    <div className="taiyobackGround">
      <div className="taiyotop">
        <h1 className="taiyoH1">FAX注文書</h1>
      </div>
      <div className="sub_top">
        <div className="sub_top2">
          <h2 className="taiyo-Data">　</h2>
          <h2 className="taiyo-Data">㈱大洋商会　御中</h2>
        </div>
        <div className="sub_top2">
          <h2 className="taiyo-Data">FAX(06)6713-9351</h2>
          <h2 className="taiyo-Data">TAL(06)6713-4456</h2>
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
                <td colSpan="6" className="special-row">
                  <h2 className="sarontop">サロン直送</h2>
                  <div className="taiyo-saron-table">
                    <tr className="saronname">
                      <td className="sarontitle">サロン名</td>
                      <td className="saronData">有限会社　吉</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">住所</td>
                      <td className="saronData">〒730-0001　広島県広島市中区白島北町</td>
                    </tr>
                    <tr className="saronname">
                      <td className="sarontitle">電話</td>
                      <td className="saronData">082-569-8401</td>
                    </tr>
                  </div>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </div>
  )
};



