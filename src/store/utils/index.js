import toast from "react-hot-toast";

export const toastfunction=(text)=>{
       toast.success(text, {
              duration: 2000,
              position: 'top-right',
            });
        }