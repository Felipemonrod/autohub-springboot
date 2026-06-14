package com.autohub.pattern.factory;

import java.util.List;

public class OficinaContext implements UserContext {

    @Override
    public UserRole getRole() {
        return UserRole.OFICINA;
    }

    @Override
    public List<String> getAllowedTabs() {
        return List.of("dashboard", "ordens-servico", "clientes", "marketplace", "chat");
    }

    @Override
    public List<String> getPermissions() {
        return List.of("VIEW_VEHICLES", "MANAGE_ORDERS", "VIEW_CLIENTS", "BUY_PRODUCTS", "SEND_MESSAGE");
    }

    @Override
    public String getWelcomeMessage() {
        return "Painel da Oficina — gerencie ordens de serviço e seus clientes.";
    }
}
