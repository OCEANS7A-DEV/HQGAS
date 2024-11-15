import React, { useState, useRef, ChangeEvent } from 'react';
import ConfirmDialog from './orderDialog';
import { InventorySearch, GASPostInsert } from '../backend/Server_end.ts';
import WordSearch from './ProductSearchWord';
import '../css/Receiving.css';

interface InsertData {
  業者: string;
  商品コード: string;
  商品名: string;
  数量: string;
  商品単価: string;
}

interface InventoryDataType {
  業者: string;
  商品コード: string;
  商品名: string;
  商品単価: string;
}

const productSearch = (code: number) => {
  const storageGet = JSON.parse(localStorage.getItem('data'));
  const product = storageGet.find(item => item[1] === code);
  return product;
};


const fieldDataList = ['業者', '商品コード', '商品名', '数量', '商品単価'];

export default function ReceivingPage() {
    const initialRowCount = 20;
    const initialFormData = Array.from({ length: initialRowCount }, () => ({
      業者: '',
      商品コード: '',
      商品名: '',
      数量: '',
      商品単価: ''
    }));
  const [formData, setFormData] = useState<InsertData[]>(initialFormData);
  const [productData, setProductData] = useState<InventoryDataType[]>([
    {業者: '', 商品コード: '', 商品名: '', 商品単価: ''}])
    const codeRefs = useRef([]);
    const quantityRefs = useRef([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const message = "入庫内容は以下の通りです\n以下の内容でよろしければOKをクリックしてください\n内容の変更がある場合にはキャンセルをクリックしてください";

    const [Date, setDate] = useState<string>('');

  const handleChange = (
    index: number,
    field: keyof InsertData,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newFormData = [...formData];
    newFormData[index][field] = event.target.value;
    setFormData(newFormData);
  };

  const addNewForm = () => {
    const newFormData = [...formData];
    for (let i = 0; i < 19; i++) {
      newFormData.push({
        業者: '',
        商品コード: '',
        商品名: '',
        数量: '',
        商品単価: ''
      });
    }
    setFormData(newFormData);
  };

  const searchDataChange = async (
    index: number,
    field: keyof InsertData,
    value: any
  ) => {
    const newFormData = [...formData];
    const updateFormData = (ResultData: any) => {
      if (ResultData !== null) {
        newFormData[index] = {
          ...newFormData[index],
          ...ResultData.slice(0, 3).reduce((obj, item, i) => ({
            ...obj,
            [fieldDataList[i]]: item,
          }), {}),
          商品単価: ResultData[3],
        };
      }
    };
    try {
      const ResultData = await productSearch(Number(value));
      updateFormData(ResultData);
    } catch (error) {
      const ResultData = await productSearch(Number(value));
      updateFormData(ResultData);
    }
    setFormData(newFormData);
  };

  const numberchange = async (
    index: number,
    field: keyof InsertData,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const CodeValue = event.target.value.replace(/[^0-9]/g, '');
    const newFormData = [...formData];
    newFormData[index][field] = CodeValue;
    setFormData(newFormData);
  };


  const insertPost = async () => {
    await GASPostInsert('insert', '本部入庫', formData, Date);
  };

  const removeForm = (index: number) => {
    const newFormData = formData.filter((_, i) => i !== index);
    newFormData.push({
      業者: '',
      商品コード: '',
      商品名: '',
      数量: '',
      商品単価: ''
    });
    setFormData(newFormData);
    codeRefs.current.splice(index, 1);
    quantityRefs.current.splice(index, 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, fieldType: '商品コード' | '数量') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (fieldType === '商品コード') {
        if (quantityRefs.current[index]) {
          quantityRefs.current[index].focus();
        }
      } else if (fieldType === '数量') {
        const nextIndex = index + 1;
        if (nextIndex < formData.length) {
          if (codeRefs.current[nextIndex]) {
            codeRefs.current[nextIndex].focus();
          }
        } else {
          addNewForm();
          setTimeout(() => {
            if (codeRefs.current[nextIndex]) {
              codeRefs.current[nextIndex].focus();
            }
          }, 0);
        }
      }
    }
  };

  const handleBlur = (index: number, fieldType: '商品コード') => {
    if (formData[index][fieldType]) {
      searchDataChange(index, fieldType, formData[index][fieldType]);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    alert('確認が完了しました');
    insertPost();
    setDialogOpen(false);
    setFormData(initialFormData);
  };

  const handleCancel = () => {
    alert('キャンセルされました');
    setDialogOpen(false);
  };

  const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  };


  return (
    <div className="window_area">
      <div className="insertDate">
        <h2>入庫日付</h2>
        <input
        type="date"
        className="insert_date"
        value={Date}
        onChange={(e) => handleChangeDate(e)}
      />
      </div>
      <div className='form_area'>
          <WordSearch className="searcharea"/>
        <div className='in-area'>
          {formData.map((data, index) => (
          <div key={index} className="insert_area">
            <input
              type="text"
              placeholder="業者"
              className="insert_vendor"
              value={data.業者}
              onChange={(e) => handleChange(index, '業者', e)}
            />
            <input
              title="入力は半角のみです"
              type="tel"
              pattern="^[0-9\-\/]+$"
              placeholder="商品コード"
              className="insert_code"
              value={data.商品コード}
              ref={(el) => (codeRefs.current[index] = el)}
              onChange={(e) => numberchange(index, '商品コード', e)}
              onKeyDown={(e) => handleKeyDown(index, e, '商品コード')}
              onBlur={() => handleBlur(index, '商品コード')}
              inputMode="numeric"
            />
            <input
              type="text"
              placeholder="商品名"
              className="insert_name"
              value={data.商品名}
              onChange={(e) => handleChange(index, '商品名', e)}
            />
            <input
              type="text"
              pattern="^[0-9]+$"
              placeholder="数量"
              className="insert_quantity"
              inputMode="numeric"
              value={data.数量}
              ref={(el) => (quantityRefs.current[index] = el)}
              onChange={(e) => numberchange(index, '数量', e)}
              onKeyDown={(e) => handleKeyDown(index, e, '数量')}
            />
            <input
              type="text"
              pattern="^[0-9]+$"
              placeholder="商品単価"
              className="insert_price"
              inputMode="numeric"
              value={data.商品単価}
              onChange={(e) => numberchange(index, '商品単価', e)}
            />
            <button type="button" className="delete_button" onClick={() => removeForm(index)}>
              削除
            </button>
          </div>
        ))}
      </div>
      <div className="button_area">
        <a className="buttonUnderlineS" type="button" onClick={addNewForm}>
          　入庫枠追加　
        </a>
        <a className="buttonUnderlineS" type="button" onClick={handleOpenDialog}>入庫実行＞＞</a>
        <ConfirmDialog
          title="確認"
          message={message}
          tableData={formData}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isOpen={isDialogOpen}
        />
      </div>
      </div>
    </div>
  );
}