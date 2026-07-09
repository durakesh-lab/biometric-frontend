import axios from "axios";

const getAuthHeader = () => {
    if (typeof window === "undefined") {
        return "";
    }

    const token = localStorage.getItem("biometric_token");
    if (!token) {
        return "";
    }

    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

export const PostApi = async (api, token, data,type) => {
    const authHeader = getAuthHeader();
    try {
        let requestOptions = {
            method: 'POST',
            body: data,
            headers:type ?  {
                "Authorization": authHeader,
            } :{
                "Authorization": authHeader,
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
     const authHeader = getAuthHeader();
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${api}`, { headers: { "Authorization": authHeader } })
        return res.data
    }
    catch (err) {
        return err
        console.log(err)
    }
}

