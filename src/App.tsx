import { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import React, { useRef } from 'react';
import HQPage from './sub_screen/process_chack.tsx';
import ReceivingPage from './sub_screen/Receiving_stock.tsx';
import TopBanner from './sub_screen/banner.tsx';
import { localStorageSet, localStoreSet } from './backend/WebStorage.ts';
import QR from './sub_screen/QR.tsx';
import PrintPage from './sub_screen/orderPrint.tsx';
import ServicePage from './sub_screen/service_items.tsx';


export default function App() {
  const [currentPage, setCurrentPage] = useState('ReceivingPage');
  const [printData, setPrintData] = useState([]);
  const [storename, setStorename] = useState<string>('');
  const [dataPages, setdataPages] = useState<number>(0);
  const nodeRef = useRef(null);
  useEffect(() => {
    localStorageSet();
    localStoreSet();
  },[]);


  const getPageComponent = (page: string) => {
    switch (page) {
      case 'ReceivingPage':
        return <ReceivingPage/>
      case 'ServicePage':
        return <ServicePage/>
      case 'HQPage':
        return <HQPage setCurrentPage={setCurrentPage} setPrintData={setPrintData} setStorename={setStorename} setdataPages={setdataPages}/>;
      case 'QRPage':
        return <QR />;
      case 'Printpage':
        return <PrintPage setCurrentPage={setCurrentPage} printData={printData} storename={storename} dataPages={dataPages}/>;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <TransitionGroup component={null}>
        <div>{currentPage !== 'Printpage' && <TopBanner setCurrentPage={setCurrentPage} />}</div>
        <CSSTransition
          key={currentPage}
          timeout={{ enter: 500, exit: 300 }}
          classNames="fade"
          nodeRef={nodeRef}
          unmountOnExit
        >
          <div ref={nodeRef} className="page">
            {getPageComponent(currentPage)}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}


