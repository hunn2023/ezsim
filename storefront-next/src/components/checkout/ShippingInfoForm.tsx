"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CheckoutFormData } from "@/lib/schemas/checkoutSchema";
import type { Language } from "@/lib/i18n";

const PROVINCES = [
  { id: "01", name: "Hà Nội" },
  { id: "02", name: "Hà Giang" },
  { id: "03", name: "Cao Bằng" },
  { id: "04", name: "Bắc Kạn" },
  { id: "05", name: "Tuyên Quang" },
  { id: "06", name: "Lào Cai" },
  { id: "07", name: "Điện Biên" },
  { id: "08", name: "Lai Châu" },
  { id: "09", name: "Sơn La" },
  { id: "10", name: "Yên Bái" },
  { id: "11", name: "Phú Thọ" },
  { id: "12", name: "Vĩnh Phúc" },
  { id: "13", name: "Bắc Giang" },
  { id: "14", name: "Quảng Ninh" },
  { id: "15", name: "Hải Dương" },
  { id: "16", name: "Hải Phòng" },
  { id: "17", name: "Hưng Yên" },
  { id: "18", name: "Thái Bình" },
  { id: "19", name: "Hà Nam" },
  { id: "20", name: "Nam Định" },
  { id: "21", name: "Ninh Bình" },
  { id: "22", name: "Thanh Hóa" },
  { id: "23", name: "Nghệ An" },
  { id: "24", name: "Hà Tĩnh" },
  { id: "25", name: "Quảng Bình" },
  { id: "26", name: "Quảng Trị" },
  { id: "27", name: "Thừa Thiên Huế" },
  { id: "28", name: "Đà Nẵng" },
  { id: "29", name: "Quảng Nam" },
  { id: "30", name: "Quảng Ngãi" },
  { id: "31", name: "Bình Định" },
  { id: "32", name: "Phú Yên" },
  { id: "33", name: "Khánh Hòa" },
  { id: "34", name: "Ninh Thuận" },
  { id: "35", name: "Bình Thuận" },
  { id: "36", name: "Kon Tum" },
  { id: "37", name: "Gia Lai" },
  { id: "38", name: "Đắk Lắk" },
  { id: "39", name: "Đắk Nông" },
  { id: "40", name: "Lâm Đồng" },
  { id: "41", name: "Bình Phước" },
  { id: "42", name: "Tây Ninh" },
  { id: "43", name: "Bình Dương" },
  { id: "44", name: "Đồng Nai" },
  { id: "45", name: "Bà Rịa - Vũng Tàu" },
  { id: "46", name: "TP. Hồ Chí Minh" },
  { id: "47", name: "Long An" },
  { id: "48", name: "Tiền Giang" },
  { id: "49", name: "Bến Tre" },
  { id: "50", name: "Trà Vinh" },
  { id: "51", name: "Vĩnh Long" },
  { id: "52", name: "Đồng Tháp" },
  { id: "53", name: "An Giang" },
  { id: "54", name: "Kiên Giang" },
  { id: "55", name: "Cần Thơ" },
  { id: "56", name: "Hậu Giang" },
  { id: "57", name: "Sóc Trăng" },
  { id: "58", name: "Bạc Liêu" },
  { id: "59", name: "Cà Mau" },
];

const DISTRICTS_BY_PROVINCE: Record<string, Array<{ id: string; name: string }>> = {
  "01": [
    { id: "001", name: "Quận Ba Đình" },
    { id: "002", name: "Quận Hoàn Kiếm" },
    { id: "003", name: "Quận Tây Hồ" },
    { id: "004", name: "Quận Long Biên" },
    { id: "005", name: "Quận Cầu Giấy" },
    { id: "006", name: "Quận Đống Đa" },
    { id: "007", name: "Quận Hà Đông" },
    { id: "008", name: "Quận Thanh Xuân" },
    { id: "009", name: "Quận Nam Từ Liêm" },
    { id: "010", name: "Quận Bắc Từ Liêm" },
  ],
  "46": [
    { id: "4601", name: "Quận 1" },
    { id: "4602", name: "Quận 2" },
    { id: "4603", name: "Quận 3" },
    { id: "4604", name: "Quận 4" },
    { id: "4605", name: "Quận 5" },
    { id: "4606", name: "Quận 6" },
    { id: "4607", name: "Quận 7" },
    { id: "4608", name: "Quận 8" },
    { id: "4609", name: "Quận 9" },
    { id: "4610", name: "Quận 10" },
    { id: "4611", name: "Quận 11" },
    { id: "4612", name: "Quận 12" },
    { id: "4613", name: "Quận Bình Thạnh" },
    { id: "4614", name: "Quận Gò Vấp" },
    { id: "4615", name: "Quận Phú Nhuận" },
    { id: "4616", name: "Quận Tân Bình" },
    { id: "4617", name: "Quận Tân Phú" },
  ],
};

const WARDS_BY_DISTRICT: Record<string, Array<{ id: string; name: string }>> = {
  "001": [
    { id: "00001", name: "Phường Phúc Xá" },
    { id: "00002", name: "Phường Trúc Bạch" },
    { id: "00003", name: "Phường Giảng Võ" },
    { id: "00004", name: "Phường Đội Cấn" },
    { id: "00005", name: "Phường Cống Vị" },
  ],
  "002": [
    { id: "00011", name: "Phường Hàng Gai" },
    { id: "00012", name: "Phường Hàng Bồ" },
    { id: "00013", name: "Phường Hàng Buồm" },
    { id: "00014", name: "Phường Hàng Trống" },
    { id: "00015", name: "Phường Hàng Bạc" },
  ],
  "4601": [
    { id: "460101", name: "Phường Bến Nghé" },
    { id: "460102", name: "Phường Cầu Kho" },
    { id: "460103", name: "Phường Cầu Ông Lánh" },
    { id: "460104", name: "Phường Nguyễn Thái Bình" },
    { id: "460105", name: "Phường Nguyễn Cư Trinh" },
  ],
  "4613": [
    { id: "461301", name: "Phường 1" },
    { id: "461302", name: "Phường 2" },
    { id: "461303", name: "Phường 3" },
    { id: "461304", name: "Phường 5" },
    { id: "461305", name: "Phường 6" },
    { id: "461306", name: "Phường 7" },
    { id: "461307", name: "Phường 11" },
    { id: "461308", name: "Phường 13" },
    { id: "461309", name: "Phường 14" },
    { id: "461310", name: "Phường 15" },
    { id: "461311", name: "Phường 17" },
    { id: "461312", name: "Phường 19" },
    { id: "461313", name: "Phường 21" },
    { id: "461314", name: "Phường 22" },
    { id: "461315", name: "Phường 24" },
    { id: "461316", name: "Phường 25" },
    { id: "461317", name: "Phường 26" },
    { id: "461318", name: "Phường 27" },
    { id: "461319", name: "Phường 28" },
  ],
};

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  language?: Language;
}

export default function ShippingInfoForm({ register, errors, setValue, watch, language = "vi" }: Props) {
  const province = watch("province");
  const district = watch("district");

  const text = {
    title: language === "vi" ? "Thông tin giao hàng" : "Shipping information",
    fullName: language === "vi" ? "Họ và tên *" : "Full name *",
    fullNamePlaceholder: language === "vi" ? "Nhập họ và tên" : "Enter full name",
    phone: language === "vi" ? "Số điện thoại *" : "Phone number *",
    phonePlaceholder: language === "vi" ? "0xxxxxxxxx hoặc +84xxxxxxxxx" : "0xxxxxxxxx or +84xxxxxxxxx",
    email: language === "vi" ? "Email (tùy chọn)" : "Email (optional)",
    province: language === "vi" ? "Tỉnh/Thành phố *" : "Province/City *",
    provincePlaceholder: language === "vi" ? "-- Chọn tỉnh/thành phố --" : "-- Select province/city --",
    district: language === "vi" ? "Quận/Huyện *" : "District *",
    districtPlaceholder: language === "vi" ? "-- Chọn quận/huyện --" : "-- Select district --",
    ward: language === "vi" ? "Phường/Xã *" : "Ward *",
    wardPlaceholder: language === "vi" ? "-- Chọn phường/xã --" : "-- Select ward --",
    addressDetail: language === "vi" ? "Địa chỉ cụ thể *" : "Address detail *",
    addressPlaceholder:
      language === "vi"
        ? "Số nhà, tên đường, tòa nhà..."
        : "House number, street name, building...",
    orderNote: language === "vi" ? "Ghi chú đơn hàng (tùy chọn)" : "Order note (optional)",
    orderNotePlaceholder:
      language === "vi"
        ? "Ghi chú cho đơn hàng (ví dụ: giao giờ hành chính)"
        : "Notes for your order (e.g. deliver during office hours)",
  };

  const districts = DISTRICTS_BY_PROVINCE[province] || [];
  const wards = WARDS_BY_DISTRICT[district] || [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("province", e.target.value);
    setValue("district", "");
    setValue("ward", "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("district", e.target.value);
    setValue("ward", "");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-navy">{text.title}</h3>

      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.fullName}</label>
        <input
          {...register("fullName")}
          className={`input ${errors.fullName ? "border-danger" : ""}`}
          placeholder={text.fullNamePlaceholder}
        />
        {errors.fullName && (
          <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.phone}</label>
        <input
          {...register("phone")}
          className={`input ${errors.phone ? "border-danger" : ""}`}
          placeholder={text.phonePlaceholder}
        />
        {errors.phone && (
          <p className="text-danger text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.email}</label>
        <input
          {...register("email")}
          type="email"
          className={`input ${errors.email ? "border-danger" : ""}`}
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="text-danger text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.province}</label>
        <select
          {...register("province")}
          onChange={handleProvinceChange}
          className={`input ${errors.province ? "border-danger" : ""}`}
        >
          <option value="">{text.provincePlaceholder}</option>
          {PROVINCES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="text-danger text-xs mt-1">{errors.province.message}</p>
        )}
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.district}</label>
        <select
          {...register("district")}
          onChange={handleDistrictChange}
          disabled={!province}
          className={`input ${errors.district ? "border-danger" : ""} ${!province ? "bg-gray-100" : ""}`}
        >
          <option value="">{text.districtPlaceholder}</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.district && (
          <p className="text-danger text-xs mt-1">{errors.district.message}</p>
        )}
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.ward}</label>
        <select
          {...register("ward")}
          disabled={!district}
          className={`input ${errors.ward ? "border-danger" : ""} ${!district ? "bg-gray-100" : ""}`}
        >
          <option value="">{text.wardPlaceholder}</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        {errors.ward && (
          <p className="text-danger text-xs mt-1">{errors.ward.message}</p>
        )}
      </div>

      {/* Address detail */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.addressDetail}</label>
        <input
          {...register("addressDetail")}
          className={`input ${errors.addressDetail ? "border-danger" : ""}`}
          placeholder={text.addressPlaceholder}
        />
        {errors.addressDetail && (
          <p className="text-danger text-xs mt-1">{errors.addressDetail.message}</p>
        )}
      </div>

      {/* Order note */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1">{text.orderNote}</label>
        <textarea
          {...register("orderNote")}
          rows={3}
          className={`input resize-none ${errors.orderNote ? "border-danger" : ""}`}
          placeholder={text.orderNotePlaceholder}
        />
        {errors.orderNote && (
          <p className="text-danger text-xs mt-1">{errors.orderNote.message}</p>
        )}
      </div>
    </div>
  );
}