import React, { useEffect, useState } from 'react';
import { ProcessConfirmationGet, OrderDeadline, orderGet, GASProcessUpdate, QuantityReset, shortageGet } from '../backend/Server_end.ts';
import { localStoreSet, PrintDataSet, SelectlocalStoreSet } from '../backend/WebStorage.ts'
import Select from 'react-select';
import '../css/process_check.css';
import DeadLineDialog from './DeadLineDialog.tsx';
import QuantityResetDialog from './QuantityResetDialog.tsx';
import toast from 'react-hot-toast';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));


interface SettingProps {
  setCurrentPage: (page: string) => void;
  setPrintData: (data: any) => void;
  setStorename: (name: string) => void;
  setdataPages: (pagenum: number) => void;
}


interface SelectOption {
  value: string;
  label: string;
}


const VendorList: SelectOption[] = [];

const VendorListGet = async () => {
  VendorList.length = 0
  const list = await JSON.parse(localStorage.getItem('vendorData') ?? '');
  for (let i = 0; i < list.length; i++){
    VendorList.push(
      {
        value: list[i][0],
        label: list[i][0]
      }
    );
  };
};

const AddressList: SelectOption[] = [];
const OceanListGet = async () => {
  AddressList.length = 0
  const alllist = await JSON.parse(sessionStorage.getItem('EtcData') ?? '');
  const list = alllist.filter(row => row[7] === 'オーシャン');
  //console.log(list)
  for (let i = 0; i < list.length; i++){
    AddressList.push(
      {
        value: list[i][0],
        label: list[i][0]
      }
    );
  };
};




const CurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = ('0' + (today.getMonth() + 1)).slice(-2)
  const day = ('0' + today.getDate()).slice(-2)
  const resultdate = year + '/' + month + '/' + day
  return resultdate
}
const DateNow = CurrentDate();

export default function HQPage({ setCurrentPage, setPrintData, setStorename, setdataPages }: SettingProps) {
  const [checkresult, setCheckResult] = useState([]); // 処理結果を管理する状態
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [storeSelect, setStoreSelect] = useState<SelectOption | null>(null);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  const message = `今回の店舗からの注文を${DateNow}で締め切りますか？`;
  const rowNum = 19;
  const [getDate, setGetDate] = useState('');
  const [addressSelect, setAdoressSelect] = useState<SelectOption | null>(null);
  const [vendorSelect, setVendorSelect] = useState<SelectOption | null>(null);


  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGetDate(event.target.value);
  };

  const PrintProcessList = async (getdate) => {
    
    const result = await ProcessConfirmationGet(getdate);
    sessionStorage.setItem('ordersdata',JSON.stringify(result));
    const storeList = await JSON.parse(localStorage.getItem('storeData'));
    const processData = [];
    const storeProcessMap = {};
    result.forEach(item => {
      const store = item[1];
      const process = item[12];
      if (!storeProcessMap[store]) {
        storeProcessMap[store] = [];
      }
      storeProcessMap[store].push(process);
    });
    for (let store in storeProcessMap) {
      processData.push({ storeName: store, process: storeProcessMap[store][0] });
    }
    const checkresult = [];
    for (let i = 0; i < storeList.length; i++) {
      var storeData = [];
      var storename = storeList[i];
      var datajudgement = storeProcessMap[storename];
      if (datajudgement !== void 0) {
        storeData = storeProcessMap[storename];
      }else{
        storeData = [];
      }
      
      var completedCount = 0;
      var pendingCount = 0;
      var receivingCount = 0;
      var nonOrderCount = 0;
      
      if (storeData.length > 0) {
        for (let i = 0; i < storeData.length; i++) {
          var Process = storeData[i];
          if (Process == '印刷済') {
            completedCount += 1;
          }else if (Process == '未印刷') {
            pendingCount += 1;
          }else if (Process == '入庫済'){
            receivingCount += 1;
          }else if (Process == '注文無'){
            nonOrderCount += 1;
          }
        }
        if (completedCount === 0 && pendingCount === 0 && receivingCount === 0 && nonOrderCount >= 1) {
          checkresult.push({ storeName: storename, process: "注文無"});
        }else if (completedCount === 0 && pendingCount >= 1 && receivingCount === 0 && nonOrderCount >= 0) {
          checkresult.push({ storeName: storename, process: "未印刷"});
        }else if (pendingCount === 0 && completedCount >= 1 && receivingCount === 0 && nonOrderCount >= 0) {
          checkresult.push({ storeName: storename, process: "印刷済"});
        }else if (completedCount >= 1 && pendingCount >= 1 && receivingCount === 0 && nonOrderCount >= 0) {
          checkresult.push({ storeName: storename, process: "一部未印刷"});
        }else if (receivingCount >= 1 && nonOrderCount >= 0){
          checkresult.push({ storeName: storename, process: "入庫済"});
        }
      } else {
        checkresult.push({ storeName: storename, process: "未注文"});
      }
    }
    setCheckResult(checkresult);
  };

  useEffect(() => {
    const getLocalStorageSize = async () => {
      const cachedData = await JSON.parse(localStorage.getItem('storeData') ?? '');
      const storedatalist: SelectOption[] = [];
      for (let i = 0; i < cachedData.length; i++){
        storedatalist.push(
          {
            value: cachedData[i][0],
            label: cachedData[i][0],
          }
        )
      }
      setSelectOptions(storedatalist);
      await SelectlocalStoreSet(storedatalist);
    }
    getLocalStorageSize();
    VendorListGet();
    OceanListGet();
  },[])

  useEffect(() =>{
    const resetDate = sessionStorage.getItem('printdate') ?? ''
    if(resetDate !== ''){
      setGetDate(resetDate);
      PrintProcessList(resetDate);
    }
  },[])



  const handleStoreChange = (selectedOption: SelectOption | null) => {
    setStoreSelect(selectedOption);
  };

  const handleVendorChange = (selectedOption: SelectOption | null) => {
    setVendorSelect(selectedOption);
  };

  const handleAddressChange = (selectedOption: SelectOption | null) => {
    setAdoressSelect(selectedOption);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    OrderDeadline();
    alert('確認が完了しました');
    setDialogOpen(false);
  };

  const handleCancel = () => {
    alert('キャンセルされました');
    setDialogOpen(false);
  };

  const handleOrderPrint = async (storeprintname: string) => {
    const orderData = await JSON.parse(sessionStorage.getItem('ordersdata'));
    sessionStorage.setItem('printdate',getDate);
    var printData = orderData.filter(row => row[1] == storeprintname);
    const pages = Math.ceil(printData.length / rowNum);
    const EmptyRow = ['','','','','','','','','','','','']
    const restrows = (pages * rowNum) - printData.length;
    for (let i = 0; i < restrows; i++) {
      printData.push(EmptyRow);
    }
    const dataPages = printData.length / rowNum;
    const dataSettings = async () => {
      setdataPages(dataPages)
      setPrintData(printData);
      setStorename(storeprintname);
    };
    await dataSettings();
    await setCurrentPage('Printpage');
    await sleep(500);
    await new Promise<void>((resolve) => {
      const onAfterPrint = () => {
        window.removeEventListener('afterprint', onAfterPrint);
        resolve();
      };
      window.addEventListener('afterprint', onAfterPrint);
      window.print();
    });

    GASProcessUpdate('店舗へ',storeprintname);
    setCurrentPage('HQPage');
  };

  const allPrint = async () => {
    const printstoreList = checkresult.filter(row => row.process == '未印刷' || row.process == '一部未印刷')
    for (let i = 0; i < printstoreList.length; i++){
      handleOrderPrint(printstoreList[i].storeName[0])
      return
    }

    return
  };

  const VendorPrint = async () => {
    if (!addressSelect || !vendorSelect) {
      toast.error('業者の選択、もしくは配送先の選択がされていません。')
      return
    }
    const resultData = await shortageGet();
    //console.log(resultData)
    const filterData = resultData.filter(row => row[12] < 0 && row[0] == vendorSelect.value)
    sessionStorage.setItem('shortageSet', JSON.stringify(filterData))
    sessionStorage.setItem('shortageVender', vendorSelect.value)
    await sessionStorage.setItem('AddressSet', addressSelect.value)
    console.log(vendorSelect.value)
    if (vendorSelect.value == '大洋商会') {
      await setCurrentPage('TaiyoPrint');
    }else if (vendorSelect.value == 'キンバト') {
      await setCurrentPage('KinbatoPrint');
    }else if (vendorSelect.value == 'ムラカミ') {
      await setCurrentPage('MurakamiPrint');
    }else if (vendorSelect.value == '三久') {
      await setCurrentPage('ThankyouPrint');
    }else if (vendorSelect.value == 'タムラ'){
      await setCurrentPage('TamuraPrint');
    } 
    //setCurrentPage('HQPage');
  }


  return (
    <div className='check_window'>
      <div className="check_area">
        <div>
          <button type="button" onClick={() => PrintProcessList(getDate)}>取得</button>
          <input
            type="date"
            className="insert_order_date"
            max="9999-12-31"
            value={getDate}
            onChange={(e) => {handleDateChange(e)}}
          />
        </div>
        {/* テーブルを表示 */}
        <div className="check">
          <table className='check'>
            <thead>
              <tr>
                <th>店舗名</th>
                <th>処理状況</th>
              </tr>
            </thead>
            <tbody>
              {checkresult.map((row, index) => (
                <tr key={index}>
                  <td className='PCstoreName'>{row.storeName}</td>
                  <td className='PCprocess'>{row.process}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='operation_area'>
        <a className="buttonUnderline" type="button" onClick={handleOpenDialog}>
          発注区切
        </a>
        <DeadLineDialog
          title="確認"
          message={message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isOpen={isDialogOpen}
        />
      </div>
      <div className="order-print">
        <div>
          <Select
            className="store-select"
            placeholder="店舗選択"
            isSearchable={false}
            value={storeSelect}
            onChange={handleStoreChange}
            options={selectOptions}
          />
        </div>
        <a className="buttonUnderline" type="button" onClick={() => handleOrderPrint(storeSelect.value)}>
          個別印刷
        </a>
        <a className="buttonUnderline" type="button" onClick={allPrint}>
          全未印刷
        </a>
      </div>
      <div className="order-print-vendor">
        <div>
          <Select
            className="store-select"
            placeholder="業者選択"
            isSearchable={false}
            value={vendorSelect}
            onChange={handleVendorChange}
            options={VendorList}
            menuPlacement="auto"
            menuPortalTarget={document.body}
          />
        </div>
        <div>
          <Select
            className="store-select"
            placeholder="配送先選択"
            isSearchable={false}
            value={addressSelect}
            onChange={handleAddressChange}
            options={AddressList}
            menuPlacement="auto"
            menuPortalTarget={document.body}
          />
        </div>
        <a className="buttonUnderline" type="button" onClick={VendorPrint}>
          業者発注印刷
        </a>
      </div>
    </div>
  );
}
