//const URL_STRING = "https://script.google.com/macros/s/AKfycbz8PJHwhgHUBf3gka4hifxA6zkCzZypyGfB-8_luSSA-zeYhb4UeKW1ktXG9ZX0F_vO/exec";
const URL_STRING = "https://script.google.com/macros/s/AKfycbznkMazxV3wlmS66uEHcOSRkI_SBQkdfT_MfMzJnvueFkSwDxGFiLlmFtq-MfMM6ldL/exec";
const Get_URL = 'https://script.google.com/macros/s/AKfycbwdZ3lhe2QH2BChceXrTsxzGAkUd9EgZ2AZ7pWXWlMJvwtOtOcjXDTOXUmdBRJgCs25/exec';

export default async function main() {};

export const InventorySearch = async(
  SearchWord: any,
  SearchColumn: any,
) => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'inventoryGet',
          sub_action: 'get',
          searchWord: SearchWord,
          sheetName: '在庫一覧',
          searchColumn: SearchColumn,
        })
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json();
    if (result.length > 1) {
      return result;
    }else{
      return null;
    }
  }catch(e){
    return (e);
  }
};

export const GASPostInsert = async (
  actionName: string,
  sheet: string,
  datail: any,
) => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: actionName,
          sub_action: 'post',
          sheetName: sheet,
          data: datail,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const ServiceInsert = async (
  actionName: string,
  sheet: string,
  datail: any,
) => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: actionName,
          sub_action: 'post',
          sheetName: sheet,
          data: datail,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const stockList = async(
) => {
  try {
    const response = await fetch(
      Get_URL,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'allData',
          sheetName: '在庫一覧',
        })
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json();
    return result;

  }catch(e){
    return (e);
  }
};

export const ProcessConfirmationGet = async (
  date: any,
) => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: 'processget',
          sub_action: 'get',
          sheetName: '店舗へ',
        })
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json();
    const filteredData = result
      .slice(1) // ヘッダー行を除外
      .filter(row => {
        const utcDate = new Date(row[0]); // UTC 時間で Date オブジェクトを作成

        // 日本時間に変換
        const japanTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 時間を加算

        // yyyy-mm-dd 形式に変換
        const formattedJapanDate = japanTime.toISOString().split('T')[0];

        // 'date' との比較
        return formattedJapanDate === date;
      });

    console.log(filteredData);

    return filteredData; // フィルタリング結果を返す
    
  }catch(e){
    return (e);
  }
};

export const ListGet = async (Range: string, sheetname: string) => {// Rangeは例'A2:B'のような形
  try {
    const response = await fetch(Get_URL, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        sheetName: sheetname,
        action: 'ListGet',
        ranges: Range,
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const OrderDeadline = async () => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: 'deadline',
          sub_action: 'post',
          sheetName: '店舗へ',
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const orderGet = async (
) => {
  try {
    const response = await fetch(URL_STRING, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        sheetName: '店舗へ',
        action: 'storeOrderGet',
        sub_action: 'get',
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const GASProcessUpdate = async (
  sheet: string,
  StoreName: string,
) => {
  console.log(sheet)
  console.log(StoreName)
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: 'processUpdate',
          sub_action: 'post',
          sheetName: sheet,
          storename: StoreName,
        }),
      },
    );
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const QuantityReset = async (
  sheet: string
) => {
  try {
    const response = await fetch(
      URL_STRING,
      {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          "Content-Type" : "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          action: 'quantityReset',
          sub_action: 'post',
          sheetName: sheet,
        }),
      },
    );
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const shortageGet = async () => {
  try {
    const response = await fetch(Get_URL, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        sheetName: '在庫一覧',
        action: 'allDataNum',
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    //console.log(result)
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

