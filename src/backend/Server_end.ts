//const URL_STRING = "https://script.google.com/macros/s/AKfycbz8PJHwhgHUBf3gka4hifxA6zkCzZypyGfB-8_luSSA-zeYhb4UeKW1ktXG9ZX0F_vO/exec";
const URL_STRING = "https://script.google.com/macros/s/AKfycbznkMazxV3wlmS66uEHcOSRkI_SBQkdfT_MfMzJnvueFkSwDxGFiLlmFtq-MfMM6ldL/exec";
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

export const stockList = async(
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
          action: 'stockList',
          sub_action: 'get',
          sheetName: '在庫一覧',
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

export const ProcessConfirmationGet = async () => {
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
    return result;
  }catch(e){
    return (e);
  }
};

export const ListGet = async () => {
  try {
    const response = await fetch(URL_STRING, {
      method: 'POST',
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        sheetName: 'その他一覧',
        action: 'storeGet',
        select: '店舗一覧',
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
