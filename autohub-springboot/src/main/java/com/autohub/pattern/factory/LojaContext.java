package com.autohub.pattern.factory;

import java.util.List;

public class LojaContext implements UserContext {

    @Override
    public UserRole getRole() {
        return UserRole.LOJA;
    }

    @Override
    public List<String> getAllowedTabs() {
        return List.of("dashboard", "estoque", "vendas", "chat");
    }

    @Override
    public List<String> getPermissions() {
        return List.of("MANAGE_PRODUCTS", "VIEW_SALES", "MANAGE_STOCK", "SEND_MESSAGE");
    }

    @Override
    public String getWelcomeMessage() {
        return "Painel da Loja — controle seu estoque e acompanhe suas vendas.";
    }
}
