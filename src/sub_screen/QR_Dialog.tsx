
import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print'

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

  const printRef = useRef<HTMLDivElement>(null);

  const [imageURL, setImageURL] = useState('');
  const JSONCodes = () => {
    Data.sort((a,b) => a[1] - b[1])
    console.log(Data)
    let resultdata = [];
    for (let i = 0; i < Data.length; i++){
      resultdata.push(Data[i][1])
    }
    const QRURL = `https://api.qrserver.com/v1/create-qr-code/?data=${resultdata}&size=300x300`
    return QRURL;
  };
  
  const QRPrint = useReactToPrint({
    contentRef: () => printRef.current,
  });

  useEffect(() => {
    const setURLString = JSONCodes();
    setImageURL(setURLString);
  },[])

  return ReactDOM.createPortal(
    <div className="order-confirm-dialog-overlay-QR">
      <div className="order-confirm-dialog">
        <div className="QR-confirm">
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
          <div className="QR-Area" ref={printRef}>
            <img src={imageURL} alt="QRコード" />
          </div>
          <div className='order-confirm-dialog-button'>
            <a
              className="buttonUnderlineSt"
              type="button"
              onClick={onConfirm}  // ボタンクリックでQRコード生成
            >OK
            </a>
            <a
              className="buttonUnderlineSt"
              type="button"
              onClick={() => QRPrint()}  // ボタンクリックでQRコード生成
            >
              印刷
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
