import React, { useEffect, useState } from 'react';

import '../css/orderPrint.css';

interface SettingProps {
  setCurrentPage: (page: string) => void;
  printData: any;
  storename: string;
  dataPages: number;
}





export default function PrintPage({ setCurrentPage, printData, storename, dataPages }: SettingProps) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [date, setDate] = useState('');
  const SetRows = 19;
  const [parsonaltext, setParsonaltext] = useState('');

  useEffect(() => {
    let resultAmount = 0;
    //let parsonalCount = 0
    for (let i = 0; i < printData.length; i++){
      resultAmount += printData[i][9];
      // if(printData[i][10] === '') {
      //   resultAmount += printData[i][9];
      // }else {
      //   parsonalCount++
      // }
    }
    const FormattedDate = sessionStorage.getItem('printdate')
    setDate(FormattedDate.replace(/-/g, '/'))
    setTotalAmount(resultAmount)
    console.log(220*1.1)
    console.log(Math.ceil(220*1.1))
  },[]);

  const totalResult = (num, price) => {
    let result = '' 
    if(num !== '' && price !== '') {
      let total = num * price
      result = total.toLocaleString('ja-JP');
    }else {
      result = ''
    }
    return result
  };

  const personalTotalAmount = (num, price, personal) => {
    let result = '';
    if(personal !== '') {
      let personalAmount = (num * price) * 1.1
      result = `税込¥${personalAmount.toLocaleString('ja-JP')}`
    }
    return result
  };
  
  const personalData = (personal) => {
    let result = '';
    if(personal !== '') {
      result = `${personal}様`
    }
    return result
  };


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
              {/* <th>業者</th> */}
              {/* <th>商品ナンバー</th> */}
              <th>商品ナンバー・商品名</th>
              <th>商品詳細</th>
              <th>注文数</th>
              <th>単価</th>
              <th>合計金額</th>
              <th>個人購入</th>
              <th>個人税込</th>
              <th>備考</th>
              {/* <th>確認</th>
              <th>確認</th> */}
            </tr>
          </thead>
          <tbody>
            {printData.map((row, index) => (
              <>
                {(index % SetRows === 0 && index > 1) && (
                  <>
                    <tr key={`condition`}>
                      <td colSpan="10" className="special-row">
                        {index/SetRows}/{dataPages}
                      </td>
                    </tr>
                  </>
                )}
                <tr key={index}>
                  <td>
                    <div className="P-code">{row[3]}</div>
                    <div className="P-name">{row[4]}</div>
                  </td>
                  <td className="P-detail">{row[5]}</td>
                  <td className="P-number">{row[6]}</td>
                  <td className="P-price">{row[8].toLocaleString('ja-JP')}</td>
                  <td className="P-totalprice">{totalResult(row[6],row[8])}</td>
                  <td className="P-personal">{personalData(row[10])}</td>
                  <td className="P-personal-taxin">{personalTotalAmount(row[6],row[8],row[10])}</td>
                  <td className="P-remarks">{row[11]}</td>
                </tr>
              </>
            ))}
            <>
              <tr key="last-condition">
                <td colSpan="11" className="special-row">
                  <div className="last-row">
                    <div className="last-page-data">{dataPages}/{dataPages}</div>
                    <div className="last-page-amount">税抜注文合計金額(個人購入・欠品分含む): ¥{Number(totalAmount).toLocaleString('ja-JP')}</div>
                  </div>
                </td>
              </tr>
            </>
          </tbody>
        </table>
      </div>
    </div>
  );
}