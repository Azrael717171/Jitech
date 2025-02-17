export interface Quotation {
  _id?: string;
  quotationNumber?: string;
  companyName: string;
  address: string;
  contactNo: string;
  tin?: string;
  clientName: string;
  quotationDate: string;
  expiryDate: string;
  reference?: string;
  salesPerson?: string;
  paymentTerm?: string;
}
