import React, { useEffect, useState } from 'react';

import '../css/orderPrint.css';

interface SettingProps {
  setCurrentPage: (page: string) => void;
  printData: any;
  storename: string;
  dataPages: number;
}

// const NowDate = () => {
//   const today = new Date();
//   const todayDate = today.toLocaleDateString('ja-JP-u-ca-japanese', {
//     dateStyle: 'long'
//   })
//   return todayDate;
// };



export default function PrintPage({ setCurrentPage, printData, storename, dataPages }: SettingProps) {
  //const Date = NowDate();
  //const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const [totalAmount, setTotalAmount] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    let resultAmount = 0;
    for (let i = 0; i < printData.length; i++){
      resultAmount += printData[i][9];
    }
    const FormattedDate = sessionStorage.getItem('printdate')
    setDate(FormattedDate)
    setTotalAmount(resultAmount)
  },[]);


  return (
    <div className="print-area">
      <div className="printData">
        <table className="printData">
          <thead>
            <tr>
              <th colSpan="10">
                <div className="printDate">
                  <div className="print-date">発注日:　{date}</div>
                  <div className="print-title">納品書</div>
                </div>
              </th>
            </tr>
            <tr className="storename">
              <th className="print-storename" colSpan="10">
                <div>{storename}</div>
              </th>
            </tr>
            <tr className="print-table-header">
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>商品詳細</th>
              <th>数量</th>
              <th>単価</th>
              <th>個人購入</th>
              <th>備考</th>
              <th>確認</th>
              <th>確認</th>
            </tr>
          </thead>
          <tbody>
          {printData.map((row, index) => (
            <>
              {(index % 27 === 0 && index > 1) && (
                <>
                  <tr key={`condition`}>
                    <td colSpan="9" className="special-row">
                      {index/27}/{dataPages}
                    </td>
                  </tr>
                </>
              )}
              <tr key={index}>
                <td className="P-vender">{row[2]}</td>
                <td className="P-code">{row[3]}</td>
                <td className="P-name">{row[4]}</td>
                <td className="P-detail">{row[5]}</td>
                <td className="P-number">{row[6]}</td>
                <td className="P-price">{row[8].toLocaleString('ja-JP')}</td>
                <td className="P-personal">{row[10]}</td>
                <td className="P-remarks">{row[11]}</td>
                <td className="chack-cell"></td>
                <td className="chack-cell"></td>
              </tr>
            </>
          ))}
          <>
            <tr key="last-condition">
              <td colSpan="10" className="special-row">
                {dataPages}/{dataPages}
              </td>
            </tr>
            <a className="total-row">合計金額: ¥{Number(totalAmount).toLocaleString('ja-JP')}</a>
          </>
          </tbody>
        </table>
      </div>
    </div>
  );
}