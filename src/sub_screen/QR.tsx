import React, { useRef, useEffect, useState } from 'react';
import '../css/QRBuild.css'

const QRBuild = () => {
  const [data, setData] = useState([]);
  const [QRData, setQRData] = useState([]);
  
  const QRDATA = (e, data) => {
    //if(e.chackbox.checked){}
    console.log(e.checkbox)
  };

  useEffect(() => {
    const setdata = JSON.parse(localStorage.getItem('data'));
    setData(setdata);
  }, []);

  return (
    <div>
      <div className="QRBuildTableArea">
        <div className="QRContent">
          <div>
            <h2>QR作成</h2>
          </div>
          <div>
            <table className="data-table-head">
              <thead>
                <tr>
                  <th className="chackbox">選択</th>
                  <th className="qr-vendor">業者名</th>
                  <th className="qr-code">商品コード</th>
                  <th className="qr-name">商品名</th>
                  <th className="qr-price">商品単価</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((row, index) => (
                    <tr key={index}>
                      <td className="chackbox"><input type="checkbox" onClick={(e) => QRDATA(e,row)}></input></td>
                      <td className="qr-vendor-td">{row[0]}</td>
                      <td className="qr-code-td">{row[1]}</td>
                      <td className="qr-name-td">{row[2]}</td>
                      <td className="qr-price-td">{row[3]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="QRButton">
            <a className="buttonUnderlineSt" type="button" onClick={console.log(QRData)}>QRコード作成</a>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default QRBuild;
