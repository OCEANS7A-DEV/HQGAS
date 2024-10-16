import React, { useEffect, useState } from 'react';
import { ProcessConfirmationGet, OrderDeadline, orderGet, GASProcessUpdate, QuantityReset } from '../backend/Server_end.ts';
import { localStoreSet, PrintDataSet, SelectlocalStoreSet } from '../backend/WebStorage.ts'
import Select from 'react-select';
import '../css/process_check.css';
import DeadLineDialog from './DeadLineDialog.tsx';
import QuantityResetDialog from './QuantityResetDialog.tsx';
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
  id: number;
}

function findStore(storeList, targetStore) {
  return storeList.find(item => item.storeName === targetStore);
}

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
  const [isQuantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [storeSelect, setStoreSelect] = useState<SelectOption | null>(null);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  const message = `今回の店舗からの注文を${DateNow}で締め切りますか？`;
  const resetmessage = '在庫一覧の現物数のデータをすべて空にします\nよろしいですか？';

  const PrintProcessList = async () => {
    const result = await ProcessConfirmationGet();
    const storeList = JSON.parse(localStorage.getItem('storeData'));
    const processData = [];
    const storeProcessMap = {};
    result.forEach(item => {
      const store = item[1];
      const process = item[11];
      if (!storeProcessMap[store]) {
        storeProcessMap[store] = [];
      }
      storeProcessMap[store].push(process);
    });
    for (let store in storeProcessMap) {
      processData.push({ storeName: store, process: storeProcessMap[store] });
    }
    const checkresult = [];
    for (let i = 0; i < storeList.length; i++) {
      var storename = storeList[i];

      var storeData = findStore(processData, storeList[i]);
      var completedCount = 0;
      var pendingCount = 0;
      if (storeData) {
        var Process = processData[i + 1].process;
        for (let i = 0; i < Process.length; i++) {
          if (Process[i] === 'completed') {
            completedCount += 1;
          }else if (Process[i] === 'pending') {
            pendingCount += 1;
          }
        }
        if (completedCount === 0 && pendingCount >= 1) {
          checkresult.push({ storeName: storename, process: "未印刷"});
        }else if (pendingCount === 0 && completedCount >= 1) {
          checkresult.push({ storeName: storename, process: "印刷済"});
        }else if (completedCount >= 1 && pendingCount >= 1) {
          checkresult.push({ storeName: storename, process: "一部未印刷"});
        }
      } else {
        checkresult.push({ storeName: storename, process: "未注文"});
      }
    }
    setCheckResult(checkresult);
  };

  useEffect(() => {
    PrintProcessList();
    const getLocalStorageSize = async () => {
      const cachedData = localStorage.getItem('SelectstoreData');
      setSelectOptions(JSON.parse(cachedData));
      await SelectlocalStoreSet(cachedData);
      const cachedData2 = localStorage.getItem('SelectstoreData');
      setSelectOptions(JSON.parse(cachedData2));
    }
    getLocalStorageSize()
  },[])

  const handleStoreChange = (selectedOption: SelectOption | null) => {
    setStoreSelect(selectedOption);
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

  const handletest = async () => {
    const storeprintname = storeSelect.value;
    const orderData = await orderGet();
    var printData = orderData.filter(row => row[1] == storeprintname);
    const pages = Math.ceil(printData.length / 26);
    const EmptyRow = ['','','','','','','','','','','','']
    const restrows = (pages * 26) - printData.length;
    for (let i = 0; i < restrows; i++) {
      printData.push(EmptyRow);
    }
    const dataPages = printData.length / 26;
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
    PrintProcessList();
  };

  const allPrint = async () => {
    const orderData = await orderGet();
    for (let i = 0; i < checkresult.length; i++){
      if (checkresult[i].process == '未印刷') {
        var printData = orderData.filter(row => row[1] == checkresult[i].storeName);
        const pages = Math.ceil(printData.length / 26);
        console.log(pages)
        const EmptyRow = ['','','','','','','','','','','','']
        const restrows = (pages * 26) - printData.length;

        for (let i = 0; i < restrows; i++) {
          printData.push(EmptyRow);
        }
        const dataPages = printData.length / 26;
        console.log(dataPages);
        const dataSettings = async () => {
          setdataPages(dataPages)
          setPrintData(printData);
          setStorename(checkresult[i].storeName);
        };
        console.log(printData);
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
        GASProcessUpdate('店舗へ',checkresult[i].storeName);
        await sleep(500);
      }
    }
    setCurrentPage('HQPage');
    PrintProcessList();
  };

  const resetConfirm = () => {
    setQuantityDialogOpen(true);
  };

  const handleResetConfirm = () => {
    actualQuantityReset();
    alert('リセットが完了しました');
    setQuantityDialogOpen(false);
  };

  const handleResetCancel = () => {
    alert('キャンセルされました');
    setQuantityDialogOpen(false);
  };

  const actualQuantityReset = async () => {
    QuantityReset('在庫一覧');
  };

  return (
    <div className='check_window'>
      <div className="check_area">
        <div>
          <button type="button" onClick={PrintProcessList}>確認と更新</button>
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
        <a className="buttonUnderline" type="button" onClick={handletest}>
          個別印刷
        </a>
        <a className="buttonUnderline" type="button" onClick={allPrint}>
          全未印刷
        </a>
        {/* <a className="buttonUnderline" type="button" onClick={resetConfirm}>
          全現物数リセット
        </a>
        <QuantityResetDialog
          title="確認"
          message={resetmessage}
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
          isOpen={isQuantityDialogOpen}
        /> */}
      </div>
    </div>
  );
}
