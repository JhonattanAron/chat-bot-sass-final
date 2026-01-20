"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircle, FileJson, Database, HelpCircle, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { TokenCounter } from "@/components/token-counter"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProduct: (product: any, method: "manual" | "api") => void
}

export function ProductModal({ open, onOpenChange, onAddProduct }: ProductModalProps) {
  const { t, language } = useLanguage()
  const [method, setMethod] = useState<"manual" | "api">("manual")
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    stock: "",
    hasStock: false,
  })
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [jsonExample, setJsonExample] = useState(`{
  "products": [
    {
      "name": "Producto 1",
      "price": "$99.99",
      "description": "Descripción del producto 1",
      "available": true,
      "stock": 25
    },
    {
      "name": "Producto 2",
      "price": "$49.99",
      "description": "Descripción del producto 2",
      "available": false,
      "stock": 0
    }
  ]
}`)

  // Nuevos estados para el mapeo de campos
  const [nameField, setNameField] = useState("name")
  const [priceField, setPriceField] = useState("price")
  const [descriptionField, setDescriptionField] = useState("description")
  const [enableDetails, setEnableDetails] = useState(false)
  const [detailsField, setDetailsField] = useState("details")
  const [enableStock, setEnableStock] = useState(false)
  const [stockField, setStockField] = useState("stock")
  const [productsArrayFormat, setProductsArrayFormat] = useState(true)
  const [productsArrayName, setProductsArrayName] = useState("products")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (method === "manual") {
      const productToAdd = {
        ...product,
        stock: product.hasStock ? product.stock : undefined,
      }
      onAddProduct(productToAdd, "manual")
      setProduct({
        name: "",
        price: "",
        description: "",
        available: true,
        stock: "",
        hasStock: false,
      })
    } else {
      // En un caso real, aquí se haría la llamada a la API
      onAddProduct(
        {
          apiUrl,
          apiKey,
          fieldMapping: {
            name: nameField,
            price: priceField,
            description: descriptionField,
            details: enableDetails ? detailsField : null,
            stock: enableStock ? stockField : null,
          },
          format: {
            isArray: productsArrayFormat,
            arrayName: productsArrayFormat ? productsArrayName : null,
          },
        },
        "api",
      )
    }
    onOpenChange(false)
  }

  const handleMethodChange = (value: string) => {
    setMethod(value as "manual" | "api")
  }

  // Calcular tokens aproximados para la descripción del producto
  const descriptionTokens = product.description.length > 0 ? Math.ceil(product.description.length / 4) : 0

  // Actualizar el ejemplo de JSON basado en las configuraciones
  const updateJsonExample = () => {
    const productExample = {
      [nameField]: "Producto Ejemplo",
      [priceField]: "$99.99",
      [descriptionField]: "Descripción del producto ejemplo",
    }

    if (enableDetails) {
      productExample[detailsField] = ["Característica 1", "Característica 2", "Característica 3"]
    }

    if (enableStock) {
      productExample[stockField] = 25
    }

    if (productsArrayFormat) {
      return JSON.stringify(
        {
          [productsArrayName]: [
            productExample,
            { ...productExample, [nameField]: "Otro Producto", ...(enableStock ? { [stockField]: 0 } : {}) },
          ],
        },
        null,
        2,
      )
    } else {
      return JSON.stringify(
        [
          productExample,
          { ...productExample, [nameField]: "Otro Producto", ...(enableStock ? { [stockField]: 0 } : {}) },
        ],
        null,
        2,
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("addProduct")}</DialogTitle>
          <DialogDescription>
            {language === "en"
              ? "Add a product or service that your chatbot can recommend to users."
              : "Añade un producto o servicio que tu chatbot pueda recomendar a los usuarios."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full" onValueChange={handleMethodChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              {language === "en" ? "Manual Entry" : "Entrada Manual"}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              {language === "en" ? "API Integration" : "Integración API"}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {language === "en" ? "Search Integration" : "Integración de Búsqueda"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">{t("productName")}</Label>
                  <Input
                    id="product-name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    placeholder={language === "en" ? "Premium Plan" : "Plan Premium"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">{t("price")}</Label>
                  <Input
                    id="product-price"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    placeholder="$99.99"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-description">{t("description")}</Label>
                    <TokenCounter count={descriptionTokens} />
                  </div>
                  <Textarea
                    id="product-description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    placeholder={
                      language === "en"
                        ? "Our premium plan includes all features..."
                        : "Nuestro plan premium incluye todas las características..."
                    }
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-available"
                    checked={product.available}
                    onCheckedChange={(checked) => setProduct({ ...product, available: checked })}
                  />
                  <Label htmlFor="product-available">{t("available")}</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="product-has-stock"
                      checked={product.hasStock}
                      onCheckedChange={(checked) => setProduct({ ...product, hasStock: checked })}
                    />
                    <Label htmlFor="product-has-stock">
                      {language === "en" ? "Track Stock (Optional)" : "Seguimiento de Stock (Opcional)"}
                    </Label>
                  </div>
                  {product.hasStock && (
                    <div className="pt-2">
                      <Label htmlFor="product-stock">
                        {language === "en" ? "Stock Quantity" : "Cantidad en Stock"}
                      </Label>
                      <Input
                        id="product-stock"
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{language === "en" ? "Add Product" : "Añadir Producto"}</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="api">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4 py-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>{language === "en" ? "Product Limits" : "Límites de Productos"}</AlertTitle>
                  <AlertDescription>
                    {language === "en"
                      ? "You can import up to 100 products via API. We recommend focusing on your best-selling products. Additional 100 products cost $10/month."
                      : "Puedes importar hasta 100 productos vía API. Recomendamos enfocarse en tus productos más vendidos. Cada 100 productos adicionales cuestan $10/mes."}
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-url">{language === "en" ? "API Endpoint URL" : "URL del Endpoint API"}</Label>
                      <Input
                        id="api-url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.yourdomain.com/products"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">
                        {language === "en" ? "API Key (optional)" : "Clave API (opcional)"}
                      </Label>
                      <Input
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={language === "en" ? "Your API key" : "Tu clave API"}
                        type="password"
                      />
                    </div>

                    <div className="rounded-md border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {language === "en" ? "JSON Format Configuration" : "Configuración de Formato JSON"}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="products-array-format"
                          checked={productsArrayFormat}
                          onCheckedChange={setProductsArrayFormat}
                        />
                        <Label htmlFor="products-array-format" className="text-sm">
                          {language === "en"
                            ? "Products are in an array property"
                            : "Los productos están en una propiedad de array"}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0" type="button">
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">Help</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {language === "en"
                                ? 'Enable if your JSON has a structure like {"products": [...]} instead of directly [...]'
                                : 'Activa si tu JSON tiene una estructura como {"productos": [...]} en lugar de directamente [...]'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {productsArrayFormat && (
                        <div className="space-y-2">
                          <Label htmlFor="products-array-name" className="text-sm">
                            {language === "en" ? "Array Property Name" : "Nombre de la Propiedad Array"}
                          </Label>
                          <Input
                            id="products-array-name"
                            value={productsArrayName}
                            onChange={(e) => setProductsArrayName(e.target.value)}
                            placeholder="products"
                            className="h-8 text-sm"
                            required={productsArrayFormat}
                          />
                        </div>
                      )}
                    </div>

                    <div className="rounded-md border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {language === "en" ? "Field Mapping" : "Mapeo de Campos"}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Map your API's field names to our standard fields. If your API uses different field names, specify them here."
                          : "Mapea los nombres de campos de tu API a nuestros campos estándar. Si tu API usa nombres diferentes, especifícalos aquí."}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="name-field" className="text-sm">
                            {language === "en" ? "Product Name Field" : "Campo de Nombre del Producto"}
                          </Label>
                          <span className="text-xs text-muted-foreground">Standard: name</span>
                        </div>
                        <Input
                          id="name-field"
                          value={nameField}
                          onChange={(e) => setNameField(e.target.value)}
                          placeholder="nombreProducto"
                          className="h-8 text-sm"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {language === "en"
                            ? "If your product names are very specific, consider using a more generic field."
                            : "Si los nombres de tus productos son muy específicos, considera usar un campo más genérico."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price-field" className="text-sm">
                            {language === "en" ? "Price Field" : "Campo de Precio"}
                          </Label>
                          <span className="text-xs text-muted-foreground">Standard: price</span>
                        </div>
                        <Input
                          id="price-field"
                          value={priceField}
                          onChange={(e) => setPriceField(e.target.value)}
                          placeholder="precio"
                          className="h-8 text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="description-field" className="text-sm">
                            {language === "en" ? "Description Field" : "Campo de Descripción"}
                          </Label>
                          <span className="text-xs text-muted-foreground">Standard: description</span>
                        </div>
                        <Input
                          id="description-field"
                          value={descriptionField}
                          onChange={(e) => setDescriptionField(e.target.value)}
                          placeholder="descripcion"
                          className="h-8 text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="enable-stock" checked={enableStock} onCheckedChange={setEnableStock} />
                          <Label htmlFor="enable-stock" className="text-sm">
                            {language === "en" ? "Include Stock Information" : "Incluir Información de Stock"}
                          </Label>
                        </div>

                        {enableStock && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="stock-field" className="text-sm">
                                {language === "en" ? "Stock Field" : "Campo de Stock"}
                              </Label>
                              <span className="text-xs text-muted-foreground">Standard: stock</span>
                            </div>
                            <Input
                              id="stock-field"
                              value={stockField}
                              onChange={(e) => setStockField(e.target.value)}
                              placeholder="inventario"
                              className="h-8 text-sm mt-1"
                              required={enableStock}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="enable-details" checked={enableDetails} onCheckedChange={setEnableDetails} />
                          <Label htmlFor="enable-details" className="text-sm">
                            {language === "en" ? "Include Product Details" : "Incluir Detalles del Producto"}
                          </Label>
                        </div>

                        {enableDetails && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="details-field" className="text-sm">
                                {language === "en" ? "Details Field" : "Campo de Detalles"}
                              </Label>
                              <span className="text-xs text-muted-foreground">Standard: details</span>
                            </div>
                            <Input
                              id="details-field"
                              value={detailsField}
                              onChange={(e) => setDetailsField(e.target.value)}
                              placeholder="detallesProducto"
                              className="h-8 text-sm mt-1"
                              required={enableDetails}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === "en" ? "Expected JSON Format" : "Formato JSON Esperado"}</Label>
                      <div className="rounded-md bg-muted p-4">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{updateJsonExample()}</pre>
                      </div>
                    </div>

                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{language === "en" ? "Important" : "Importante"}</AlertTitle>
                      <AlertDescription>
                        {language === "en"
                          ? "Make sure your API endpoint is publicly accessible and returns data in the format shown above."
                          : "Asegúrate de que tu endpoint API sea accesible públicamente y devuelva datos en el formato mostrado arriba."}
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit">{language === "en" ? "Connect API" : "Conectar API"}</Button>
                  </DialogFooter>
                </form>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="search">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4 py-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>{language === "en" ? "Search Integration" : "Integración de Búsqueda"}</AlertTitle>
                  <AlertDescription>
                    {language === "en"
                      ? "Connect your website's search API to allow the chatbot to find products in real-time when users ask about them."
                      : "Conecta la API de búsqueda de tu sitio web para permitir que el chatbot encuentre productos en tiempo real cuando los usuarios pregunten por ellos."}
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search-api-url">
                        {language === "en" ? "Search API Endpoint URL" : "URL del Endpoint de la API de Búsqueda"}
                      </Label>
                      <Input id="search-api-url" placeholder="https://api.yourdomain.com/search?q={query}" required />
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Use {query} as a placeholder where the search term will be inserted."
                          : "Usa {query} como marcador de posición donde se insertará el término de búsqueda."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search-api-key">
                        {language === "en" ? "API Key (optional)" : "Clave API (opcional)"}
                      </Label>
                      <Input
                        id="search-api-key"
                        placeholder={language === "en" ? "Your API key" : "Tu clave API"}
                        type="password"
                      />
                    </div>

                    <div className="rounded-md border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {language === "en" ? "Response Mapping" : "Mapeo de Respuesta"}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Map your search API's response fields to our standard product fields."
                          : "Mapea los campos de respuesta de tu API de búsqueda a nuestros campos estándar de producto."}
                      </p>

                      <div className="space-y-2">
                        <Label htmlFor="search-results-path" className="text-sm">
                          {language === "en" ? "Results Array Path" : "Ruta del Array de Resultados"}
                        </Label>
                        <Input id="search-results-path" placeholder="results" className="h-8 text-sm" required />
                        <p className="text-xs text-muted-foreground">
                          {language === "en"
                            ? "The path to the array of search results in the API response (e.g., 'data.results', 'items')"
                            : "La ruta al array de resultados de búsqueda en la respuesta de la API (ej., 'data.results', 'items')"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search-name-field" className="text-sm">
                          {language === "en" ? "Product Name Field" : "Campo de Nombre del Producto"}
                        </Label>
                        <Input id="search-name-field" placeholder="title" className="h-8 text-sm" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search-price-field" className="text-sm">
                          {language === "en" ? "Price Field" : "Campo de Precio"}
                        </Label>
                        <Input id="search-price-field" placeholder="price" className="h-8 text-sm" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search-description-field" className="text-sm">
                          {language === "en" ? "Description Field" : "Campo de Descripción"}
                        </Label>
                        <Input
                          id="search-description-field"
                          placeholder="description"
                          className="h-8 text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search-image-field" className="text-sm">
                          {language === "en" ? "Image URL Field (optional)" : "Campo de URL de Imagen (opcional)"}
                        </Label>
                        <Input id="search-image-field" placeholder="image" className="h-8 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search-url-field" className="text-sm">
                          {language === "en" ? "Product URL Field (optional)" : "Campo de URL del Producto (opcional)"}
                        </Label>
                        <Input id="search-url-field" placeholder="url" className="h-8 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {language === "en" ? "Example Search Scenario" : "Ejemplo de Escenario de Búsqueda"}
                      </Label>
                      <div className="rounded-md bg-muted p-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {language === "en" ? "User Query:" : "Consulta del Usuario:"}
                          </p>
                          <p className="text-sm italic">
                            "{language === "en" ? "I need clothes for cold weather" : "Necesito ropa para el frío"}"
                          </p>

                          <p className="text-sm font-medium mt-4">
                            {language === "en" ? "Bot Search:" : "Búsqueda del Bot:"}
                          </p>
                          <p className="text-sm italic">
                            "
                            {language === "en"
                              ? "sweaters for cold weather, winter jackets, thermal shirts"
                              : "sudaderas para el frío, chaquetas de invierno, camisas térmicas"}
                            "
                          </p>

                          <p className="text-sm font-medium mt-4">{language === "en" ? "Results:" : "Resultados:"}</p>
                          <p className="text-sm">
                            {language === "en"
                              ? "The bot will map the first 10 results from your search API and present them to the user in a structured format."
                              : "El bot mapeará los primeros 10 resultados de tu API de búsqueda y los presentará al usuario en un formato estructurado."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{language === "en" ? "Important" : "Importante"}</AlertTitle>
                      <AlertDescription>
                        {language === "en"
                          ? "For this feature to work effectively, your search API must be intelligent enough to understand natural language queries. Otherwise, the bot may not find what the user is asking for. Consider implementing semantic search or AI-powered search for best results."
                          : "Para que esta función funcione de manera efectiva, tu API de búsqueda debe ser lo suficientemente inteligente para entender consultas en lenguaje natural. De lo contrario, el bot puede no encontrar lo que el usuario está pidiendo. Considera implementar búsqueda semántica o búsqueda potenciada por IA para obtener mejores resultados."}
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="submit">
                      {language === "en" ? "Connect Search API" : "Conectar API de Búsqueda"}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
