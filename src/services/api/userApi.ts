const API_CONFIG = {
  // MySQL API endpoints
  baseURL: "http://192.168.1.104:8080/user",

  // MinIO configuration
  minioEndpoint: "http://localhost:9000",
  minioBucket: "family-stories",
};

export async function selectRole(userId: number) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/selectUser/${userId}`);
    const resData = await response.json();
    
    if (resData.code === 0) {
      // 这里的 resData.data 就是你后端返回的 User 对象
      const userInfo = resData.data;
      
      // 存入 LocalStorage 实现“记住我”
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      return userInfo;
    }
  } catch (error) {
    console.error("角色切换失败:", error);
  }
}