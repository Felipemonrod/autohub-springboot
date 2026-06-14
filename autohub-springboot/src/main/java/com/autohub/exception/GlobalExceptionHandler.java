package com.autohub.exception;

import com.autohub.dto.ApiResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * Centraliza o tratamento de exceções e garante que todos os erros
 * retornem o envelope ApiResponse padronizado com o código HTTP correto.
 *
 * Códigos RFC 7231 tratados aqui:
 *   - 400 Bad Request  (validação de entrada)
 *   - 404 Not Found    (recurso inexistente)
 *   - 409 Conflict     (recurso duplicado)
 *   - 500 Internal Server Error (erros inesperados)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * HTTP 404 Not Found (RFC 7231, Section 6.5.4)
     * Retornado quando o recurso solicitado não existe no banco.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        ApiResponse<Void> body = ApiResponse.error(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                "RESOURCE_NOT_FOUND"
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    /**
     * HTTP 409 Conflict (RFC 7231, Section 6.5.8)
     * Retornado quando há tentativa de criar um recurso já existente (ex: placa duplicada).
     * O cabeçalho X-Error-Code facilita o diagnóstico pelo cliente.
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(DuplicateResourceException ex) {
        ApiResponse<Void> body = ApiResponse.error(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                ex.getErrorCode()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Error-Code", ex.getErrorCode());

        return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers).body(body);
    }

    /**
     * HTTP 400 Bad Request (RFC 7231, Section 6.5.1)
     * Retornado quando o corpo da requisição falha na validação do Bean Validation.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        ApiResponse<Void> body = ApiResponse.error(
                HttpStatus.BAD_REQUEST.value(),
                "Dados inválidos: " + errors,
                "VALIDATION_ERROR"
        );

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * HTTP 500 Internal Server Error (RFC 7231, Section 6.6.1)
     * Fallback para erros inesperados.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
        ApiResponse<Void> body = ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno do servidor: " + ex.getMessage(),
                "INTERNAL_ERROR"
        );

        return ResponseEntity.internalServerError().body(body);
    }
}
