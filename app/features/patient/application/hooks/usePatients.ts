import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PatientService } from '../services/PatientService'
import type { CreatePatientRequestDto, UpdatePatientRequestDto, CreateHealthRecordRequestDto } from '../../infrastructure/dto/PatientDto'

const patientService = PatientService.getInstance()

/**
 * 환자 목록 조회 훅
 */
export const usePatients = (filters?: {
  nurseId?: string
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getPatients(filters),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

/**
 * 특정 환자 조회 훅
 */
export const usePatient = (patientId: string) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatient(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * 환자 생성 뮤테이션 훅
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (patientData: CreatePatientRequestDto) => 
      patientService.createPatient(patientData),
    onSuccess: () => {
      // 환자 목록 쿼리 무효화하여 리패치 유도
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

/**
 * 환자 정보 업데이트 뮤테이션 훅
 */
export const useUpdatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ patientId, patientData }: {
      patientId: string
      patientData: UpdatePatientRequestDto
    }) => patientService.updatePatient(patientId, patientData),
    onSuccess: (updatedPatient) => {
      // 특정 환자 쿼리 업데이트
      queryClient.setQueryData(['patient', updatedPatient.id], updatedPatient)
      // 환자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

/**
 * 환자 삭제 뮤테이션 훅
 */
export const useDeletePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (patientId: string) => patientService.deletePatient(patientId),
    onSuccess: (_, patientId) => {
      // 캐시에서 삭제된 환자 제거
      queryClient.removeQueries({ queryKey: ['patient', patientId] })
      // 환자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}

/**
 * 환자 검색 훅
 */
export const useSearchPatients = (query: string, nurseId?: string) => {
  return useQuery({
    queryKey: ['patients', 'search', query, nurseId],
    queryFn: () => patientService.searchPatients(query, nurseId),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  })
}

/**
 * 환자 건강 기록 조회 훅
 */
export const usePatientHealthRecords = (patientId: string, limit?: number) => {
  return useQuery({
    queryKey: ['healthRecords', patientId, limit],
    queryFn: () => patientService.getPatientHealthRecords(patientId, limit),
    enabled: !!patientId,
    staleTime: 3 * 60 * 1000, // 3분
  })
}

/**
 * 건강 기록 추가 뮤테이션 훅
 */
export const useAddHealthRecord = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (recordData: CreateHealthRecordRequestDto) => 
      patientService.addHealthRecord(recordData),
    onSuccess: (newRecord) => {
      // 해당 환자의 건강 기록 쿼리 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['healthRecords', newRecord.patientId] 
      })
    },
  })
}

/**
 * 환자 통계 조회 훅
 */
export const usePatientStats = (nurseId?: string) => {
  return useQuery({
    queryKey: ['patientStats', nurseId],
    queryFn: () => patientService.getPatientStats(nurseId),
    staleTime: 10 * 60 * 1000, // 10분
  })
} 