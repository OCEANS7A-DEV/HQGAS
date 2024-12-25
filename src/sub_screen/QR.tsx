import React, { useEffect, useState } from 'react';
import '../css/QRBuild.css';
import ConfirmDialog from './QR_Dialog';

const QRBuild = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);  // 選択した行の管理
  const [isDialogOpen, setDialogOpen] = useState(false);

  // チェックボックスが変更されたときの処理
  const handleCheckboxChange = (e, row) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, row]);  // 選択された行を追加
    } else {
      setSelectedRows((prev) => prev.filter((item) => item !== row));  // 選択解除
    }
  };

  // QRコード作成ボタンを押したときの処理
  const handleGenerateQR = () => {
    setDialogOpen(true)
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
                {
                  data.map((row, index) => (
                    <tr key={index}>
                      <td className="qr-checkbox-td">
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(e, row)}
                        />
                      </td>
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
            <a
              className="buttonUnderlineSt"
              type="button"
              onClick={handleGenerateQR}  // ボタンクリックでQRコード生成
            >
              QRコード作成
            </a>
          </div>
          <ConfirmDialog
            title="生成QR"
            message="QRコードの生成が完了しました"
            Data={selectedRows}
            onConfirm={handleConfirm}
            isOpen={isDialogOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default QRBuild;
