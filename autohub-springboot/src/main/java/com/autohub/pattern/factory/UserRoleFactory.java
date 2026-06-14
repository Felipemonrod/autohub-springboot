package com.autohub.pattern.factory;

/**
 * Padrão Factory — cria o contexto correto com base no papel do usuário.
 *
 * Uso:
 *   UserContext ctx = UserRoleFactory.create(UserRole.OFICINA);
 *   ctx.getPermissions(); // [MANAGE_ORDERS, ...]
 */
public final class UserRoleFactory {

    private UserRoleFactory() {}

    public static UserContext create(UserRole role) {
        return switch (role) {
            case CLIENTE -> new ClienteContext();
            case OFICINA -> new OficinaContext();
            case LOJA    -> new LojaContext();
        };
    }

    public static UserContext create(String roleString) {
        try {
            UserRole role = UserRole.valueOf(roleString.toUpperCase());
            return create(role);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Papel de usuário inválido: '" + roleString + "'. Use CLIENTE, OFICINA ou LOJA."
            );
        }
    }
}
