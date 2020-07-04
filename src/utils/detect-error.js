// 定义类型
let equipmentType = ""

function detect(){
    const agent = navigator.userAgent.toLowerCase();
    const android = agent.indexOf("android");
    const iphone = agent.indexOf("iphone");
    const ipad = agent.indexOf("ipad");
    if(android != -1){
      equipmentType = "android";
    }
    if(iphone != -1 || ipad != -1){
      equipmentType = "ios";
    }
}

export function detectData(errorData){
    // 检测客户端 iOS 或者 android
    detect()
    console.log(equipmentType)
    console.log(errorData)
    if (equipmentType == 'android') {
        const info = JSON.stringify(errorData);
        window.cosmetics.reLogin(info);
    } else if (equipmentType == 'ios') {
        window.webkit.messageHandlers.reLogin.postMessage(errorData);
    }
}

