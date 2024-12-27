import React, { useEffect, useState } from 'react';
import '../css/QRBuild.css';
import ConfirmDialog from './QR_Dialog';

const QRBuild = () => {
  const [data, setData] = useState([]); // テーブルデータ
  const [selectedRows, setSelectedRows] = useState([]); // 選択された行
  const [isDialogOpen, setDialogOpen] = useState(false); // ダイアログ表示制御
  const [QRSelectData, setQRSelectData] = useState([])
  const [subMessage, setSubMessage] = useState([]);

  // チェックボックス変更時の処理
  const handleCheckboxChange = (e, index) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, index]); // 選択した行を追加
    } else {
      setSelectedRows((prev) => prev.filter((item) => item !== index)); // 選択解除
    }
  };

  // QRコード作成ボタンを押したときの処理
  const handleGenerateQR = () => {
    const resultData = selectedRows.map((index) => data[index])
    if(resultData.length === 0){
      console.log('選択されている商品がありません')
      return
    }
    setQRSelectData(resultData)
    setSubMessage(resultData.map(row => row[2]))
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
  };

  // ローカルストレージからデータを取得
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data'));
    setData(storedData || []);
  }, []);

  return (
    <div>
      <div className="QRBuildTableArea">
        <div className="QRContent">
          <div>
            <h2>QR作成</h2>
            <button
              className="buttonUnderlineSt"
              type="button"
              onClick={() => setSelectedRows([])} // 選択状況をリセット
            >
              選択状況リセット
            </button>
          </div>
          <div>
            <table className="data-table-head">
              <thead>
                <tr>
                  <th className="qr-checkbox">選択</th>
                  <th className="qr-vendor">業者名</th>
                  <th className="qr-code">商品コード</th>
                  <th className="qr-name">商品名</th>
                  <th className="qr-price">商品単価</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="qr-checkbox-td">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)} // 状態を制御
                        onChange={(e) => handleCheckboxChange(e, index)}
                      />
                    </td>
                    <td className="qr-vendor-td">{row[0]}</td>
                    <td className="qr-code-td">{row[1]}</td>
                    <td className="qr-name-td">{row[2]}</td>
                    <td className="qr-price-td">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="QRButton">
            <button
              className="buttonUnderlineSt"
              type="button"
              onClick={handleGenerateQR} // ボタンクリックでQRコード生成
            >
              QRコード作成
            </button>
          </div>
          <ConfirmDialog
            title="生成QR"
            message="QRコードの生成が完了しました"
            Data={QRSelectData}
            onConfirm={handleConfirm}
            isOpen={isDialogOpen}
            submessage={subMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default QRBuild;
