package com.autohub.pattern.factory;

import java.util.List;

public class ClienteContext implements UserContext {

    @Override
    public UserRole getRole() {
        return UserRole.CLIENTE;
    }

    @Override
    public List<String> getAllowedTabs() {
        return List.of("dashboard", "meus-veiculos", "servicos", "marketplace", "chat");
    }

    @Override
    public List<String> getPermissions() {
        return List.of("VIEW_VEHICLES", "VIEW_SERVICES", "BUY_PRODUCTS", "SEND_MESSAGE");
    }

    @Override
    public String getWelcomeMessage() {
        return "Bem-vindo ao AutoHub! Gerencie seus veículos e acompanhe seus serviços.";
    }
}
