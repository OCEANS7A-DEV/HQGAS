import React, { useState, ChangeEvent } from 'react';
import '../css/ProductSearchWord.css';
import { searchStr } from '../backend/WebStorage.ts';

export default function WordSearch() {
  const [SWord, setSWord] = useState<string>(''); // 検索ワードの状態
  const [tableData, setTableData] = useState<any[]>([]); // 検索結果を保存する状態

  // テキスト入力が変更されたときに実行される関数
  const handlewordchange = (event: ChangeEvent<HTMLInputElement>) => {
    setSWord(event.target.value); // 入力された値をSWordにセット
  };

  // 商品の再検索を行い、結果を状態に保存
  const productReSearch = async () => {
    const result = await searchStr(SWord); // 検索関数を実行
    setTableData(result); // 結果を状態にセット
  };

  return (
    <div className="WordSearch-area">
      <div className="search-input">
        <input
          type="text"
          value={SWord}
          onChange={handlewordchange}
          placeholder="検索ワードを入力"
        />
        <a className="buttonUnderlineS" type="button" onClick={productReSearch}>
          検索
        </a>
      </div>

      {/* テーブルを表示 */}
      <div className="search-table">
        <table className="search-data-table">
          <thead>
            <tr>
              <th className='stcode'>商品コード</th>
              <th className='stname'>商品名</th>
            </tr>
          </thead>
          <tbody className='datail'>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="scode">{row[1]}</td> {/* 商品コードは配列の2番目の要素 */}
                <td className="sname">{row[2]}</td> {/* 商品名は配列の3番目の要素 */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
