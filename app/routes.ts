import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("presentation/pages/home/Home.tsx"),
  route("login", "presentation/pages/login/Login.tsx"),
  
  // 간호사 모드 라우트
  route("nurse/dashboard", "presentation/pages/nurse/Dashboard.tsx"),
  route("nurse/consultation", "presentation/pages/nurse/Consultation.tsx"),
  route("nurse/patients", "presentation/pages/nurse/Patients.tsx"),
  route("nurse/patients/:id", "presentation/pages/nurse/PatientDetail.tsx"),
  route("nurse/video-call", "presentation/pages/nurse/VideoCall.tsx"),
  
  // 관리자 모드 라우트
  route("admin/hospital", "presentation/pages/admin/Hospital.tsx"),
  route("admin/settings", "presentation/pages/admin/Settings.tsx"),
] satisfies RouteConfig;
