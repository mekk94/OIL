export const SERVICES_CONFIG = [
  { key: 'civil', image: 'images/services/Civil.webp' },
  { key: 'electrical', image: 'images/services/Electrical.webp' },
  { key: 'mechanical', image: 'images/services/Mechanical.webp' },
] as const;

export type ServiceKey = (typeof SERVICES_CONFIG)[number]['key'];

/** Sub-service image paths — same order as services.<key>.items in en.json/ar.json */
export const SUBSERVICE_IMAGES: Record<ServiceKey, string[]> = {
  civil: [
    'images/service-detail/Civil/Structural Design & Construction.webp',
    'images/service-detail/Civil/Roads & Infrastructure.webp',
    'images/service-detail/Civil/Marine & Coastal Works.webp',
    'images/service-detail/Civil/Industrial Facilities.webp',
    'images/service-detail/Civil/Concrete Works & Foundations.webp',
    'images/service-detail/Civil/Site Development & Grading.webp',
  ],
  electrical: [
    'images/service-detail/Electrical/HVMVLV Power Systems.webp',
    'images/service-detail/Electrical/Substation Design & Construction.webp',
    'images/service-detail/Electrical/Instrumentation & Control.webp',
    'images/service-detail/Electrical/Fire Detection & Suppression.webp',
    'images/service-detail/Electrical/Lighting & Earthing Systems.webp',
    'images/service-detail/Electrical/Cable Management & Trays.webp',
  ],
  mechanical: [
    'images/service-detail/Mechanical/Piping & Pipeline Systems.webp',
    'images/service-detail/Mechanical/HVAC & Ventilation.webp',
    'images/service-detail/Mechanical/Equipment Erection & Commissioning.webp',
    'images/service-detail/Mechanical/Pressure Vessels & Tanks.webp',
    'images/service-detail/Mechanical/Insulation & Painting.webp',
    'images/service-detail/Mechanical/Rotating Equipment.webp',
  ],
};