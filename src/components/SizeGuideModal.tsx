import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ruler, Users, User } from "lucide-react";
import { useSizeGuide } from "@/contexts/SizeGuideContext";

const mensTopData = [
  { size: "XXS", length: "27", chest: "32", shoulder: "15", hips: "32", sleeve: "8" },
  { size: "XS", length: "28", chest: "35", shoulder: "16", hips: "35", sleeve: "8.5" },
  { size: "S", length: "28.5", chest: "38", shoulder: "17", hips: "38", sleeve: "9" },
  { size: "M", length: "29", chest: "42", shoulder: "18", hips: "42", sleeve: "9.5" },
  { size: "L", length: "29.5", chest: "45", shoulder: "19", hips: "45", sleeve: "10" },
  { size: "XL", length: "30", chest: "48", shoulder: "20", hips: "48", sleeve: "10.5" },
  { size: "XXL", length: "31", chest: "50", shoulder: "21", hips: "50", sleeve: "11" },
  { size: "XXXL", length: "32", chest: "53", shoulder: "22", hips: "53", sleeve: "11.5" },
];

const mensPantData = [
  { size: "XXS", length: "38", hip: "37", waist: "28" },
  { size: "XS", length: "38", hip: "38", waist: "29" },
  { size: "S", length: "40", hip: "41", waist: "32" },
  { size: "M", length: "41", hip: "45", waist: "36" },
  { size: "L", length: "42", hip: "49", waist: "40" },
  { size: "XL", length: "43", hip: "53", waist: "44" },
  { size: "XXL", length: "44", hip: "57", waist: "48" },
  { size: "XXXL", length: "45", hip: "61", waist: "52" },
];

const femaleTopData = [
  { size: "XXS", length: "26", chest: "30", shoulder: "14", hips: "31", sleeve: "7" },
  { size: "XS", length: "27", chest: "32", shoulder: "15", hips: "33", sleeve: "7.5" },
  { size: "S", length: "27.5", chest: "35", shoulder: "16", hips: "36", sleeve: "8" },
  { size: "M", length: "28", chest: "40", shoulder: "17", hips: "40", sleeve: "8.5" },
  { size: "L", length: "29", chest: "43", shoulder: "18", hips: "43", sleeve: "9" },
  { size: "XL", length: "29.5", chest: "45", shoulder: "19", hips: "45", sleeve: "9.5" },
  { size: "XXL", length: "30", chest: "48", shoulder: "20", hips: "48", sleeve: "10" },
  { size: "XXXL", length: "31", chest: "50", shoulder: "21", hips: "50", sleeve: "10.5" },
];

const femalePantData = [
  { size: "XXS", length: "38", hip: "36", waist: "26" },
  { size: "XS", length: "39", hip: "37", waist: "26.5" },
  { size: "S", length: "39.5", hip: "38", waist: "27" },
  { size: "M", length: "40", hip: "42", waist: "32" },
  { size: "L", length: "41", hip: "45", waist: "38" },
  { size: "XL", length: "42", hip: "50", waist: "41" },
  { size: "XXL", length: "44", hip: "55", waist: "45" },
  { size: "XXXL", length: "46", hip: "56", waist: "46" },
];

const SizeGuideModal = () => {
  const { isOpen, closeSizeGuide } = useSizeGuide();

  return (
    <Dialog open={isOpen} onOpenChange={closeSizeGuide}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-soft-gray/30 backdrop-blur-xl border-medical-blue/20 p-4 sm:p-6">
        <DialogHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-medical-blue/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg sm:rounded-xl shadow-glow">
              <Ruler className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                AURA Medical Size Chart
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Measurements in Inches - Ready Body Measurement</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="mens-top" className="w-full mt-4 sm:mt-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-soft-gray/50 backdrop-blur-sm rounded-xl gap-1">
            <TabsTrigger 
              value="mens-top" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-medical-blue data-[state=active]:to-medical-teal data-[state=active]:text-white rounded-lg py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Mens </span>Top
            </TabsTrigger>
            <TabsTrigger 
              value="mens-pant" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-medical-blue data-[state=active]:to-medical-teal data-[state=active]:text-white rounded-lg py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Mens </span>Pant
            </TabsTrigger>
            <TabsTrigger 
              value="female-top" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-medical-blue data-[state=active]:to-medical-teal data-[state=active]:text-white rounded-lg py-2 sm:py-3 text-xs sm:text-sm"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Female </span>Top
            </TabsTrigger>
            <TabsTrigger 
              value="female-pant" 
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-medical-blue data-[state=active]:to-medical-teal data-[state=active]:text-white rounded-lg py-2 sm:py-3 text-xs sm:text-sm"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Female </span>Pant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mens-top" className="mt-4 sm:mt-6">
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-medical-blue/20 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-medical-blue to-medical-teal p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">Mens Top</Badge>
                  <span className="text-xs sm:text-sm md:text-base">Ready Body Measurement</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-soft-gray/50 hover:bg-soft-gray/50">
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SIZES</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">LENGTH</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">CHEST</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SHOULDER</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">HIPS</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SLEEVE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mensTopData.map((row, index) => (
                      <TableRow key={row.size} className={index % 2 === 0 ? "bg-background" : "bg-soft-gray/30"}>
                        <TableCell className="font-bold text-medical-blue text-xs sm:text-sm">{row.size}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.length}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.chest}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.shoulder}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.hips}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.sleeve}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mens-pant" className="mt-4 sm:mt-6">
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-medical-blue/20 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-medical-blue to-medical-teal p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">Mens Pant</Badge>
                  <span className="text-xs sm:text-sm md:text-base">Ready Body Measurement</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-soft-gray/50 hover:bg-soft-gray/50">
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SIZES</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">LENGTH</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">HIP</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">WAIST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mensPantData.map((row, index) => (
                      <TableRow key={row.size} className={index % 2 === 0 ? "bg-background" : "bg-soft-gray/30"}>
                        <TableCell className="font-bold text-medical-blue text-xs sm:text-sm">{row.size}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.length}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.hip}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.waist}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="female-top" className="mt-4 sm:mt-6">
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-medical-blue/20 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-medical-blue to-medical-teal p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">Female Top</Badge>
                  <span className="text-xs sm:text-sm md:text-base">Ready Body Measurement</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-soft-gray/50 hover:bg-soft-gray/50">
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SIZES</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">LENGTH</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">CHEST</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SHOULDER</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">HIPS</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SLEEVE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {femaleTopData.map((row, index) => (
                      <TableRow key={row.size} className={index % 2 === 0 ? "bg-background" : "bg-soft-gray/30"}>
                        <TableCell className="font-bold text-medical-blue text-xs sm:text-sm">{row.size}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.length}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.chest}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.shoulder}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.hips}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.sleeve}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="female-pant" className="mt-4 sm:mt-6">
            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-medical-blue/20 shadow-card bg-card/50 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-medical-blue to-medical-teal p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg flex flex-col xs:flex-row items-start xs:items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">Female Pant</Badge>
                  <span className="text-xs sm:text-sm md:text-base">Ready Body Measurement</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-soft-gray/50 hover:bg-soft-gray/50">
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">SIZES</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">LENGTH</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">HIP</TableHead>
                      <TableHead className="font-bold text-luxury-navy text-xs sm:text-sm whitespace-nowrap">WAIST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {femalePantData.map((row, index) => (
                      <TableRow key={row.size} className={index % 2 === 0 ? "bg-background" : "bg-soft-gray/30"}>
                        <TableCell className="font-bold text-medical-blue text-xs sm:text-sm">{row.size}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.length}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.hip}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{row.waist}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 rounded-lg sm:rounded-xl border border-medical-blue/20">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            <span className="font-semibold text-medical-blue">📏 Measuring Tip:</span> For the most accurate fit, measure while wearing light clothing. Need help? Contact our sizing experts!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal;
