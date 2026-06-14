package com.autohub.pattern.factory;

import java.util.List;

/**
 * Interface do padrão Factory — define o contrato de contexto por papel de usuário.
 * Cada implementação encapsula as permissões e abas disponíveis para um perfil.
 */
public interface UserContext {

    UserRole getRole();

    List<String> getAllowedTabs();

    List<String> getPermissions();

    String getWelcomeMessage();
}
