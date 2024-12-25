
import React from 'react';
import ReactDOM from 'react-dom';

import '../css/orderDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  Data: Array<any>;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, Data, onConfirm, isOpen }) => {
  if (!isOpen) return null;
  const JSONCodes = () => {
    let resultdata = [];
    for (let i = 0; i < Data.length; i++){
      resultdata.push(Data[i][1])
    }
    const QRURL = `https://api.qrserver.com/v1/create-qr-code/?data=${resultdata}&size=100x100`
    return QRURL;
  };

  return ReactDOM.createPortal(
    <div className="order-confirm-dialog-overlay">
      <div className="order-confirm-dialog">
        <div className="order-confirm-top">
          <h2>{title}</h2>
          <p>
            {message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        {/* テーブルを表示 */}
        <div className="order-dialog-table">
          <img src={JSONCodes} alt="QRコード" />
          <div className='order-confirm-dialog-button'>
            <button onClick={onConfirm}>OK</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
