// 对uuid进行二次封装，这样就不会每次发送请求都生成一个新的uuid了
import { v4 as uuidv4 } from 'uuid';
export const UUID = () =>{
    // 先获取uuid_token
    let uuid_token=localStorage.getItem('uuid_token')
    if(!uuid_token){
        // 若localStorage中不存在uuid_token，则新生成一个
        uuid_token=uuidv4()
        localStorage.setItem('uuid_token',uuid_token)
    }
    return uuid_token;
}
