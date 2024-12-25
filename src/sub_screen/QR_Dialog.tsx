
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

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [imageURL, setImageURL] = useState('');
  const JSONCodes = () => {
    Data.sort((a,b) => a[1] - b[1])
    console.log(Data)
    let resultdata = [];
    for (let i = 0; i < Data.length; i++){
      resultdata.push(Data[i][1])
    }
    const QRURL = `https://api.qrserver.com/v1/create-qr-code/?data=${resultdata}&size=200x200`
    return QRURL;
  };
  

  useEffect(() => {
    const setURLString = JSONCodes();
    setImageURL(setURLString);
  },[])

  return (
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
          <div className="QR-Area" ref={contentRef}>
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
              onClick={() => reactToPrintFn()}  // ボタンクリックでQRコード生成
            >
              印刷
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
