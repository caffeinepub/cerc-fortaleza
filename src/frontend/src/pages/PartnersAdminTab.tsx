import { CompraSeguraBadge } from "@/components/CompraSeguraBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Store {
  id: number;
  name: string;
  category: string;
  neighborhood: string;
  address: string;
  whatsapp: string;
  status: "ativo" | "inativo";
}

const initialStores: Store[] = [
  {
    id: 1,
    name: "TechPhone Fortaleza",
    category: "Celulares",
    neighborhood: "Meireles",
    address: "Av. Beira Mar, 1000",
    whatsapp: "5585999990001",
    status: "ativo",
  },
  {
    id: 2,
    name: "BikeShop CE",
    category: "Bicicletas",
    neighborhood: "Aldeota",
    address: "Rua das Flores, 250",
    whatsapp: "5585999990002",
    status: "ativo",
  },
  {
    id: 3,
    name: "EletroCenter",
    category: "Eletrônicos",
    neighborhood: "Centro",
    address: "Rua Major Facundo, 500",
    whatsapp: "5585999990003",
    status: "ativo",
  },
  {
    id: 4,
    name: "MotoAcessórios CE",
    category: "Acessórios",
    neighborhood: "Parangaba",
    address: "Av. Borges de Melo, 800",
    whatsapp: "5585999990004",
    status: "ativo",
  },
  {
    id: 5,
    name: "SmartStore Fortaleza",
    category: "Celulares",
    neighborhood: "Bairro de Fátima",
    address: "Rua Eduardo Garcia, 120",
    whatsapp: "5585999990005",
    status: "ativo",
  },
  {
    id: 6,
    name: "CicloMania",
    category: "Bicicletas",
    neighborhood: "Varjota",
    address: "Rua Tibúrcio Cavalcante, 450",
    whatsapp: "5585999990006",
    status: "ativo",
  },
];

const CATEGORIES = ["Celulares", "Bicicletas", "Eletrônicos", "Acessórios"];

function getBadgeCode(storeName: string): string {
  return `<!-- Selo Compra Segura CERC - ${storeName} -->
<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:#f0fdf4;border:2px solid #6ee7b7;font-family:sans-serif">
  <svg width="18" height="18" fill="none" stroke="#059669" stroke-width="2.5" viewBox="0 0 24 24">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  <div>
    <p style="font-size:12px;font-weight:800;color:#065f46;margin:0;text-transform:uppercase;letter-spacing:.05em">Compra Segura</p>
    <p style="font-size:10px;font-weight:600;color:#047857;margin:0">Verificado CERC</p>
  </div>
</div>
<!-- Fim do Selo CERC -->`;
}

export function PartnersAdminTab() {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [badgeStore, setBadgeStore] = useState<Store | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    neighborhood: "",
    address: "",
    whatsapp: "",
  });

  const handleAdd = () => {
    if (!form.name || !form.category || !form.neighborhood) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const newStore: Store = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      neighborhood: form.neighborhood,
      address: form.address,
      whatsapp: form.whatsapp,
      status: "ativo",
    };
    setStores((prev) => [...prev, newStore]);
    setForm({
      name: "",
      category: "",
      neighborhood: "",
      address: "",
      whatsapp: "",
    });
    setAddOpen(false);
    toast.success("Loja adicionada com sucesso!");
  };

  const handleDelete = (id: number) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
    setDeleteTarget(null);
    toast.success("Loja removida.");
  };

  const copyBadgeCode = (store: Store) => {
    navigator.clipboard.writeText(getBadgeCode(store.name));
    toast.success("Código copiado!");
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            Lojas Parceiras
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stores.length} lojas cadastradas com Selo Compra Segura
          </p>
        </div>

        {/* Add store dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="admin.partners.add_button"
              className="bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Loja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-primary">
                Nova Loja Parceira
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da loja parceira CERC.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="store-name">Nome da loja *</Label>
                <Input
                  id="store-name"
                  placeholder="Ex: TechPhone Fortaleza"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="store-category">Categoria *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger id="store-category">
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="store-neighborhood">Bairro *</Label>
                <Input
                  id="store-neighborhood"
                  placeholder="Ex: Meireles"
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, neighborhood: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="store-address">Endereço</Label>
                <Input
                  id="store-address"
                  placeholder="Rua, número"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="store-whatsapp">WhatsApp</Label>
                <Input
                  id="store-whatsapp"
                  placeholder="5585999990000"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, whatsapp: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddOpen(false)}
                data-ocid="admin.partners.cancel_button"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-primary text-white"
                data-ocid="admin.partners.confirm_button"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border-2 border-border overflow-hidden"
        data-ocid="admin.partners.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-bold text-primary">Nome</TableHead>
              <TableHead className="font-bold text-primary">
                Categoria
              </TableHead>
              <TableHead className="font-bold text-primary hidden sm:table-cell">
                Bairro
              </TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store, idx) => (
              <TableRow
                key={store.id}
                className="hover:bg-muted/20 transition-colors"
              >
                <TableCell className="font-semibold">{store.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {store.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">
                  {store.neighborhood}
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold">
                    {store.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Badge code button */}
                    <Dialog
                      open={badgeStore?.id === store.id}
                      onOpenChange={(open) => {
                        if (!open) setBadgeStore(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          data-ocid="admin.partners.badge_code.button.1"
                          variant="outline"
                          size="sm"
                          className="text-xs border-primary/30 text-primary hover:bg-primary hover:text-white"
                          onClick={() => setBadgeStore(store)}
                        >
                          <Code2 className="w-3.5 h-3.5 mr-1" />
                          Código
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="font-display font-bold text-primary flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Código do Selo
                          </DialogTitle>
                          <DialogDescription>
                            Copie este código HTML e cole no site da loja para
                            exibir o Selo Compra Segura.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-2">
                          <div className="mb-3 flex justify-center">
                            <CompraSeguraBadge size="lg" />
                          </div>
                          <pre className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all border border-border">
                            {badgeStore ? getBadgeCode(badgeStore.name) : ""}
                          </pre>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() =>
                              badgeStore && copyBadgeCode(badgeStore)
                            }
                            className="bg-primary text-white"
                            data-ocid="admin.partners.save_button"
                          >
                            Copiar Código
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete */}
                    <Dialog
                      open={deleteTarget === store.id}
                      onOpenChange={(open) => {
                        if (!open) setDeleteTarget(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          data-ocid={`admin.partners.delete_button.${idx + 1}`}
                          variant="outline"
                          size="sm"
                          className="text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                          onClick={() => setDeleteTarget(store.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="font-display font-bold">
                            Remover Loja
                          </DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja remover{" "}
                            <strong>{store.name}</strong> das lojas parceiras?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            data-ocid="admin.partners.cancel_button"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleDelete(store.id)}
                            className="bg-destructive text-white"
                            data-ocid="admin.partners.confirm_button"
                          >
                            Remover
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
