import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Eye, Trash2, Plus, LayoutTemplate, ChevronRight, ArrowLeft, Check, ChevronsUpDown, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { TABLE_OPTIONS, TABLE_COLUMNS, DATABASE_TABLES, OPERATOR_OPTIONS } from "@/constants";
import { generateId } from "@/lib/arrayUtils";

interface QueryTemplateDialogProps {
  onSelectQuery: (query: string, description?: string) => void;
  trigger?: React.ReactNode;
}

type View = "selection" | "select-builder" | "update-builder" | "delete-builder" | "insert-builder" | "drop-builder";

interface Condition {
  id: string;
  field: string;
  value: string;
  operator: string;
  disabled?: boolean;
}

export function QueryTemplateDialog({ onSelectQuery, trigger }: QueryTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("selection");
  const [selectedTable, setSelectedTable] = useState<string>(DATABASE_TABLES.CRIME_INCIDENTS);
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", field: "", value: "", operator: "" }
  ]);
  const [openTableSelect, setOpenTableSelect] = useState(false);

  const reset = () => {
    setView("selection");
    setConditions([{ id: "1", field: "", value: "", operator: "" }]);
    setSelectedTable(DATABASE_TABLES.CRIME_INCIDENTS);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const addCondition = () => {
    setConditions([...conditions, { id: generateId(), field: "", value: "", operator: "" }]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    } else {
        // If it's the last one, just clear it
        setConditions([{ id: generateId(), field: "", value: "", operator: "" }]);
    }
  };

  const toggleCondition = (id: string) => {
      setConditions(conditions.map(c => c.id === id ? { ...c, disabled: !c.disabled } : c));
  };

  const updateCondition = (id: string, key: keyof Condition, val: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [key]: val } : c));
  };

  const generateQuery = () => {
    // Mock generation logic based on view and conditions
    let query = "";
    let description = "";
    const activeConditions = conditions.filter(c => !c.disabled);
    const whereClause = activeConditions
      .filter(c => c.field && c.value)
      .map(c => `${c.field} ${c.operator || '='} '${c.value}'`)
      .join(" AND ");
    
    const whereDescription = activeConditions
      .filter(c => c.field && c.value)
      .map(c => `${c.field} 의 값이 '${c.value}' 과 ${c.operator || '등호(=)'} 일 경우`)
      .join(" 그리고 ");

    if (view === "select-builder") {
      query = `SELECT * FROM ${selectedTable}`;
      if (whereClause) query += ` WHERE ${whereClause}`;
      
      description = `${selectedTable} 전체를 선택하기`;
      if (whereDescription) description = `${description} (단, ${whereDescription})`;

    } else if (view === "update-builder") {
      query = `UPDATE ${selectedTable} SET status = 'Closed'`;
      if (whereClause) query += ` WHERE ${whereClause}`;
      description = `${selectedTable} 의 데이터를 수정하기`;
       if (whereDescription) description = `${description} (조건: ${whereDescription})`;

    } else if (view === "delete-builder") {
        query = `DELETE FROM ${selectedTable}`;
        if (whereClause) query += ` WHERE ${whereClause}`;
        description = `${selectedTable} 의 데이터를 삭제하기`;
        if (whereDescription) description = `${description} (조건: ${whereDescription})`;

    } else if (view === "insert-builder") {
        query = `INSERT INTO ${selectedTable} (type, location, severity, status) VALUES ('Theft', 'Downtown', 5, 'Open')`;
        description = `${selectedTable} 에 새로운 데이터를 추가하기`;

    } else if (view === "drop-builder") {
        query = `DROP TABLE ${selectedTable}`;
        description = `${selectedTable} 테이블을 완전히 삭제하기`;
    }
    
    onSelectQuery(query + ";", description);
    handleClose();
  };

  const getTemplateTitle = () => {
      switch(view) {
          case "select-builder": return "SELECT 쿼리문 생성 템플릿";
          case "update-builder": return "UPDATE 쿼리문 생성 템플릿";
          case "delete-builder": return "DELETE 쿼리문 생성 템플릿";
          case "insert-builder": return "INSERT 쿼리문 생성 템플릿";
          case "drop-builder": return "DROP 쿼리문 생성 템플릿";
          default: return "";
      }
  };

  const currentFields = TABLE_COLUMNS[selectedTable as keyof typeof TABLE_COLUMNS] || [];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) reset();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutTemplate className="w-4 h-4" />
            Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[800px] flex flex-col p-0 gap-0 overflow-hidden">
        {view === "selection" ? (
          <div className="flex-1 flex flex-col bg-secondary/5">
            <div className="p-8 pb-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-lg">
                   <LayoutTemplate className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-bold">Query Manager</h2>
               </div>
               <p className="text-muted-foreground">당신의 데이터를 원하는대로 빠르게 편집하세요</p>
            </div>

            <div className="flex-1 p-8 grid grid-cols-3 gap-6 overflow-y-auto content-start">
               {/* Select Template Card */}
               <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px]" onClick={() => setView("select-builder")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">S</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Select</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    조건에 맞는 데이터를 조회하기 위한 SELECT 쿼리를 시각적으로 생성합니다.
                  </p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">템플릿 열기</Button>
               </Card>

               {/* Update Template Card */}
               <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px]" onClick={() => setView("update-builder")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">U</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Update</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    데이터를 수정하기 위한 UPDATE 쿼리를 안전하게 생성합니다.
                  </p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">템플릿 열기</Button>
               </Card>

               {/* Delete Template Card */}
               <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px]" onClick={() => setView("delete-builder")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">D</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Delete</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    불필요한 데이터를 삭제하기 위한 DELETE 쿼리를 생성합니다.
                  </p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">템플릿 열기</Button>
               </Card>

               {/* Insert Template Card */}
                <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px]" onClick={() => setView("insert-builder")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">I</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Insert</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    새로운 데이터를 추가하기 위한 INSERT 쿼리를 생성합니다.
                  </p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">템플릿 열기</Button>
               </Card>

               {/* Drop Template Card */}
               <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px]" onClick={() => setView("drop-builder")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-sm">D</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Drop</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    테이블이나 데이터베이스를 완전히 삭제하는 DROP 쿼리를 생성합니다.
                  </p>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">템플릿 열기</Button>
               </Card>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-background">
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-card/50">
               <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => setView("selection")}>
                     <ArrowLeft className="w-4 h-4" /> 뒤로
                   </Button>
                   <Separator orientation="vertical" className="h-4" />
                   <span className="font-medium text-sm ml-2">{getTemplateTitle()}</span>
               </div>
            </div>

            {/* Builder Content */}
            <div className="flex-1 p-8 overflow-y-auto">
               <div className="max-w-3xl mx-auto space-y-12">
                  {/* Table Selection */}
                  <div>
                     <h3 className="text-xl font-light mb-2 flex items-baseline gap-2">
                       <Popover open={openTableSelect} onOpenChange={setOpenTableSelect}>
                          <PopoverTrigger asChild>
                             <button className="font-medium border-b-2 border-foreground pb-1 outline-none hover:text-primary hover:border-primary transition-colors flex items-center gap-1">
                               {selectedTable ? TABLE_OPTIONS.find(t => t.value === selectedTable)?.label : "Table"}
                               <ChevronsUpDown className="w-3 h-3 text-muted-foreground" />
                             </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search table..." />
                              <CommandList>
                                <CommandEmpty>No table found.</CommandEmpty>
                                <CommandGroup>
                                  {TABLE_OPTIONS.map((table) => (
                                    <CommandItem
                                      key={table.value}
                                      value={table.value}
                                      onSelect={(currentValue) => {
                                        setSelectedTable(currentValue);
                                        setOpenTableSelect(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedTable === table.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {table.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                       </Popover>
                       전체를 선택하기
                     </h3>
                     <p className="text-sm text-muted-foreground">대상 테이블: <span className="font-mono text-foreground">{selectedTable}</span></p>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-center relative">
                        <Separator className="absolute w-full" />
                        <Button variant="outline" size="sm" className="relative bg-background text-xs rounded-full h-7" onClick={addCondition}>
                          <Plus className="w-3 h-3 mr-1" /> 조건추가
                        </Button>
                     </div>

                     <div className="space-y-8">
                        {conditions.map((condition, index) => (
                          <div key={condition.id} className={cn("animate-in slide-in-from-bottom-2 duration-300", condition.disabled && "opacity-40 grayscale")}>
                             <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider flex items-center gap-2">
                               {index === 0 ? "Primary Condition" : `AND 조건 ${index}`}
                               {condition.disabled && <span className="text-muted-foreground font-normal text-[10px] border px-1 rounded">(Disabled)</span>}
                             </div>
                             <div className="flex items-center gap-4 group">
                                <div className="flex-1 flex items-baseline text-lg sm:text-xl font-light flex-wrap gap-2">
                                   <div className="relative min-w-[160px]">
                                      <Popover>
                                         <PopoverTrigger asChild>
                                            <button className="w-full text-left border-b-2 border-muted-foreground/20 px-0 py-1 h-auto text-lg font-medium focus:outline-none focus:border-foreground text-center hover:border-primary/50 transition-colors">
                                               {condition.field || <span className="text-muted-foreground/30">field</span>}
                                            </button>
                                         </PopoverTrigger>
                                         <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                               <CommandInput placeholder="Search field..." />
                                               <CommandList>
                                                  <CommandEmpty>No field found.</CommandEmpty>
                                                  <CommandGroup>
                                                     {currentFields.map((field) => (
                                                        <CommandItem
                                                           key={field.value}
                                                           value={field.value}
                                                           onSelect={(val) => updateCondition(condition.id, 'field', val)}
                                                        >
                                                           <Check className={cn("mr-2 h-4 w-4", condition.field === field.value ? "opacity-100" : "opacity-0")} />
                                                           {field.label}
                                                        </CommandItem>
                                                     ))}
                                                  </CommandGroup>
                                               </CommandList>
                                            </Command>
                                         </PopoverContent>
                                      </Popover>
                                   </div>
                                   <span>의 값이</span>
                                   <div className="relative min-w-[120px]">
                                      <Input 
                                        placeholder="value" 
                                        className="h-9 text-base text-center bg-background"
                                        value={condition.value}
                                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                                        disabled={condition.disabled}
                                      />
                                   </div>
                                   <span>과</span>
                                   <div className="relative w-[80px]">
                                      <Select 
                                        value={condition.operator} 
                                        onValueChange={(val) => updateCondition(condition.id, 'operator', val)}
                                        disabled={condition.disabled}
                                      >
                                        <SelectTrigger className="border-0 border-b-2 border-muted-foreground/20 rounded-none px-0 py-1 h-auto text-lg font-medium focus:ring-0 focus:border-foreground shadow-none">
                                          <SelectValue placeholder="등호" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {OPERATOR_OPTIONS.slice(0, 4).map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                   </div>
                                   <span>일 경우</span>
                                </div>
                                
                                <div className="flex items-center gap-1 transition-opacity">
                                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeCondition(condition.id)}>
                                      <Trash2 className="w-4 h-4" />
                                   </Button>
                                   <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => toggleCondition(condition.id)}>
                                      {condition.disabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                   </Button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-background flex justify-center">
               <Button className="bg-black text-white hover:bg-black/90 px-8" onClick={generateQuery}>
                 쿼리 추가
               </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
