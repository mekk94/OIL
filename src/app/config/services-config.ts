export const SERVICES_CONFIG = [
  { key: 'civil', image: 'images/services/Civil.png' },
  { key: 'electrical', image: 'images/services/Electrical.png' },
  { key: 'mechanical', image: 'images/services/Mechanical.png' },
] as const;

export type ServiceKey = (typeof SERVICES_CONFIG)[number]['key'];

/** Sub-service image paths — same order as services.<key>.items in en.json/ar.json */
export const SUBSERVICE_IMAGES: Record<ServiceKey, string[]> = {
  civil: [
    'images/service-detail/Civil/Structural Design & Construction.png',
    'images/service-detail/Civil/Roads & Infrastructure.png',
    'images/service-detail/Civil/Marine & Coastal Works.png',
    'images/service-detail/Civil/Industrial Facilities.png',
    'images/service-detail/Civil/Concrete Works & Foundations.png',
    'images/service-detail/Civil/Site Development & Grading.png',
  ],
  electrical: [
    'images/service-detail/Electrical/HVMVLV Power Systems.png',
    'images/service-detail/Electrical/Substation Design & Construction.png',
    'images/service-detail/Electrical/Instrumentation & Control.png',
    'images/service-detail/Electrical/Fire Detection & Suppression.png',
    'images/service-detail/Electrical/Lighting & Earthing Systems.png',
    'images/service-detail/Electrical/Cable Management & Trays.png',
  ],
  mechanical: [
    'images/service-detail/Mechanical/Piping & Pipeline Systems.png',
    'images/service-detail/Mechanical/HVAC & Ventilation.png',
    'images/service-detail/Mechanical/Equipment Erection & Commissioning.png',
    'images/service-detail/Mechanical/Pressure Vessels & Tanks.png',
    'images/service-detail/Mechanical/Insulation & Painting.png',
    'images/service-detail/Mechanical/Rotating Equipment.png',
  ],
};