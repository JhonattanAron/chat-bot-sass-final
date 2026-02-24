'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PaymentMethodsTab() {
  return (
    <div className="space-y-6">
      {/* Botón de Agregar */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Método de Pago
        </Button>
      </div>

      {/* Métodos de Pago Guardados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarjeta de Crédito 1 */}
        <Card className="border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg text-foreground">Visa</CardTitle>
                  <Badge className="bg-primary/20 text-primary border-0">Predeterminada</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">•••• •••• •••• 4242</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Vence</p>
                <p className="text-sm font-semibold text-foreground">12/26</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">Nombre: Juan Pérez</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-foreground hover:bg-input"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Crédito 2 */}
        <Card className="border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-foreground mb-2">Mastercard</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">•••• •••• •••• 5555</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Vence</p>
                <p className="text-sm font-semibold text-foreground">09/25</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">Nombre: Juan Pérez</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-foreground hover:bg-input"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PayPal */}
        <Card className="border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-foreground mb-2">PayPal</CardTitle>
                <p className="text-sm text-muted-foreground">juan.perez@paypal.com</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center text-sm text-green-500">
              <Check className="w-4 h-4 mr-1" />
              Verificado
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-foreground hover:bg-input"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-border text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Métodos */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Resumen de Métodos de Pago</CardTitle>
          <CardDescription>Estadísticas de uso y seguridad</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-input rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total de Métodos</p>
            <p className="text-3xl font-bold text-foreground">3</p>
          </div>
          <div className="p-4 bg-input rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Transacciones Este Mes</p>
            <p className="text-3xl font-bold text-foreground">24</p>
          </div>
          <div className="p-4 bg-input rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Tasa de Seguridad</p>
            <p className="text-3xl font-bold text-green-500">100%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
