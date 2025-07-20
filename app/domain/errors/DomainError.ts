// Domain Layer - 도메인별 에러 정의

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly type: string;
  public readonly details?: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    
    // Error 스택 추적을 위한 설정
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// 인증 관련 에러들
export class AuthenticationError extends DomainError {
  readonly code = 'AUTH_001';
  readonly type = 'AUTHENTICATION';
}

export class InvalidCredentialsError extends DomainError {
  readonly code = 'AUTH_002';
  readonly type = 'AUTHENTICATION';
}

export class UnauthorizedError extends DomainError {
  readonly code = 'AUTH_003';
  readonly type = 'AUTHORIZATION';
}

export class SessionExpiredError extends DomainError {
  readonly code = 'AUTH_004';
  readonly type = 'AUTHENTICATION';
}

// 유효성 검증 에러들
export class ValidationError extends DomainError {
  readonly code = 'VAL_001';
  readonly type = 'VALIDATION';
}

export class RequiredFieldError extends DomainError {
  readonly code = 'VAL_002';
  readonly type = 'VALIDATION';
  
  constructor(fieldName: string) {
    super(`${fieldName} is required`, { fieldName });
  }
}

export class InvalidFormatError extends DomainError {
  readonly code = 'VAL_003';
  readonly type = 'VALIDATION';
  
  constructor(fieldName: string, expectedFormat: string) {
    super(`${fieldName} has invalid format. Expected: ${expectedFormat}`, { fieldName, expectedFormat });
  }
}

export class MinLengthError extends DomainError {
  readonly code = 'VAL_004';
  readonly type = 'VALIDATION';
  
  constructor(fieldName: string, minLength: number, actualLength: number) {
    super(`${fieldName} must be at least ${minLength} characters long. Actual: ${actualLength}`, { fieldName, minLength, actualLength });
  }
}

// 비즈니스 로직 에러들
export class BusinessRuleViolationError extends DomainError {
  readonly code = 'BIZ_001';
  readonly type = 'BUSINESS_RULE';
}

export class ResourceNotFoundError extends DomainError {
  readonly code = 'RES_001';
  readonly type = 'RESOURCE';
  
  constructor(resourceType: string, resourceId: string | number) {
    super(`${resourceType} with id ${resourceId} not found`, { resourceType, resourceId });
  }
}

export class DuplicateResourceError extends DomainError {
  readonly code = 'RES_002';
  readonly type = 'RESOURCE';
  
  constructor(resourceType: string, conflictField: string, value: any) {
    super(`${resourceType} with ${conflictField} '${value}' already exists`, { resourceType, conflictField, value });
  }
}

// 권한 관련 에러들
export class InsufficientPermissionError extends DomainError {
  readonly code = 'PERM_001';
  readonly type = 'PERMISSION';
  
  constructor(requiredPermission: string) {
    super(`Insufficient permission. Required: ${requiredPermission}`, { requiredPermission });
  }
}

export class AccessDeniedError extends DomainError {
  readonly code = 'PERM_002';
  readonly type = 'PERMISSION';
} 