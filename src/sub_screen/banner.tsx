
import '../css/a_button.css';
import '../css/banner.css';
import React, { useRef, useEffect, useState } from 'react';

interface SettingProps {
  setCurrentPage: (page: string) => void;
  style?: React.CSSProperties;
}


export default function TopBanner({ setCurrentPage }: SettingProps) {
  const clickpage = (pageName: string) => {
    setCurrentPage(pageName);
  };
  const [scannedData, setscannedData] = useState<string>('');

  // データを受信するためのメッセージイベントのリスナーを設定
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 外部サイトからのデータを受信
      if (event.origin === 'https://script.google.com') {
        const scannedData = event.data;
        console.log('取得したデータ:', scannedData);
        setscannedData(scannedData);
        // 必要な処理をここで実行
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <div className='banner-area'>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('QRBuildPage')}>
          QRコード作成
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('ReceivingPage')}>
          入庫処理
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('ServicePage')}>
          サービス品入庫
        </a>
        <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('HQPage')}>
          印刷関係
        </a>
        {/* <a className="buttonUnderline" id="main_back" type="button" onClick={() => clickpage('KinbatoPrintPage')}>
          print
        </a> */}
      </div>
    </div>
  );
}
