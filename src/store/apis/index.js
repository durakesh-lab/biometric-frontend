import axios from "axios";


export const PostApi = async (api, token, data,type) => {
    token=localStorage.getItem("biometric_token")
    try {
        let requestOptions = {
            method: 'POST',
            body: data,
            headers:type ?  {
                "Authorization": `${token}`,
            } :{
                "Authorization": `Bearer ${token}`,
                'Content-Type':'application/json'
            },
            redirect: 'follow'
        };
        // const res = await fetch(`${Base_Url}send-money/update/wallet-manual/status/${datas?.request_id}`, requestOptions);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${api}`, requestOptions);

        const result = await res.json();
        return result;
    } catch (error) {
        console.log("🚀   ~ error:", error)
    }
}

export const GetApi = async (api, derivedtoken) => {
     token=localStorage.getItem("biometric_token")
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${api}`, { headers: { "Authorization": `${token}`} })
        return res.data
    }
    catch (err) {
        return err
        console.log(err)
    }
}

