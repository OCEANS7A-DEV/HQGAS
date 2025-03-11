import { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import React, { useRef } from 'react';
import HQPage from './sub_screen/process_chack.tsx';
import ReceivingPage from './sub_screen/Receiving_stock.tsx';
import TopBanner from './sub_screen/banner.tsx';
import { localStorageSet, localStoreSet, localVendorSet, ETCDATAGET } from './backend/WebStorage.ts';
import QRBuild from './sub_screen/QR.tsx';
import PrintPage from './sub_screen/orderPrint.tsx';
import ServicePage from './sub_screen/service_items.tsx';
import TaiyoPrint from './sub_screen/taiyoPrint.tsx';
import KinbatoPrintPage from './sub_screen/kinbatoPrint.tsx';
import MurakamiPrintPage from './sub_screen/murakamiPrint';
import ThankyouPrintPage from './sub_screen/ThankyouPrint';
import TamuraPrintPage from './sub_screen/Tamura.tsx';

import TEST from './sub_screen/Print.tsx';


export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('ReceivingPage');
  const [printData, setPrintData] = useState([]);
  const [storename, setStorename] = useState<string>('');
  const [dataPages, setdataPages] = useState<number>(0);

  const nodeRef = useRef(null);
  useEffect(() => {
    localStorageSet();
    localStoreSet();
    localVendorSet();
    ETCDATAGET();
  },[]);


  const getPageComponent = (page: string) => {
    switch (page) {
      case 'ReceivingPage':
        return <ReceivingPage/>
      case 'ServicePage':
        return <ServicePage/>
      case 'HQPage':
        return <HQPage setCurrentPage={setCurrentPage} setPrintData={setPrintData} setStorename={setStorename} setdataPages={setdataPages}/>;
      case 'QRBuildPage':
        return <QRBuild />;
      case 'Printpage':
        return <PrintPage setCurrentPage={setCurrentPage} printData={printData} storename={storename} dataPages={dataPages}/>;
      case 'TEST':
        return <TEST/>;
      case 'TaiyoPrint':
        return <TaiyoPrint setCurrentPage={setCurrentPage} printData={printData} dataPages={dataPages}/>;
      case 'KinbatoPrint':
        return <KinbatoPrintPage setCurrentPage={setCurrentPage}/>;
      case 'MurakamiPrint':
        return <MurakamiPrintPage setCurrentPage={setCurrentPage}/>;
      case 'ThankyouPrint':
        return <ThankyouPrintPage setCurrentPage={setCurrentPage}/>;
      case 'TamuraPrint':
        return <TamuraPrintPage setCurrentPage={setCurrentPage}/>;
      default:
        return null;
    }
  };

  return (
    <>
      <TopBanner setCurrentPage={setCurrentPage} />
      <TransitionGroup component={null}>
        {/* <div>{currentPage !== 'Printpage' && currentPage !== 'TaiyoPrint' && currentPage !== 'KinbatoPrint' && currentPage !== 'MurakamiPrint' && currentPage !== 'ThankyouPrint' && currentPage !== 'TamuraPrint' && <TopBanner setCurrentPage={setCurrentPage} />}</div> */}
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
    </>
    
  );
}


