import React, { useEffect, useState } from 'react';

import '../css/orderPrint.css';

interface SettingProps {
  setCurrentPage: (page: string) => void;
}

const NowDate = () => {
  const today = new Date();
  const todayDate = today.toLocaleDateString('ja-JP-u-ca-japanese', {
    dateStyle: 'long'
  })
  return todayDate;
};



export default function PrintPage({ setCurrentPage }: SettingProps) {
  const [data, setData] = useState([]);
  const [Date, setDate] = useState<string>('');
  const [storename, setStore] = useState<string>('');
  const [pagenumber, setpagenumber] = useState<number>(0);
  useEffect(() => {
    const PrintData = JSON.parse(sessionStorage.getItem('Printdata'));
    setData(PrintData)
    setDate(NowDate());
    setStore(sessionStorage.getItem('Printname'));
    const pages = PrintData.length / 26;
    console.log(pages);
  },[]);
  return (
    <div className="print-area">
      <div className="printData">
        <table className="printData">
          <thead>
            <tr>
              <th colSpan="2">
                {Date}
              </th>
            </tr>
            <tr className="storename">
              <th className="print-storename" colSpan="9">{storename}</th>
            </tr>
            <tr className="print-table-header">
              <th>業者</th>
              <th>商品コード</th>
              <th>商品名</th>
              <th>商品詳細</th>
              <th>数量</th>
              <th>個人購入</th>
              <th>備考</th>
              <th>確認</th>
              <th>確認</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row,index) => (
              <tr key={index}>
                <td className="P-vender">{row[2]}</td>
                <td className="P-code">{row[3]}</td>
                <td className="P-name">{row[4]}</td>
                <td className="P-detail">{row[5]}</td>
                <td className="P-number">{row[6]}</td>
                <td className="P-personal">{row[9]}</td>
                <td className="P-remarks">{row[10]}</td>
                <td className="chack-cell"></td>
                <td className="chack-cell"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}