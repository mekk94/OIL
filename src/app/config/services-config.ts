export const SERVICES_CONFIG = [
  { key: 'civil', image: '/images/services/Civil.jpg' },
  { key: 'electrical', image: '/images/services/Electrical.jpg' },
  { key: 'mechanical', image: '/images/services/Mechanical.jpg' },
] as const;

export type ServiceKey = (typeof SERVICES_CONFIG)[number]['key'];

/** Sub-service image paths — same order as services.<key>.items in en.json/ar.json */
export const SUBSERVICE_IMAGES: Record<ServiceKey, string[]> = {
  civil: [
    '/images/service-detail/Civil/Structural Design & Construction.jpg',
    '/images/service-detail/Civil/Roads & Infrastructure.jpg',
    '/images/service-detail/Civil/Marine & Coastal Works.jpg',
    '/images/service-detail/Civil/Industrial Facilities.jpg',
    '/images/service-detail/Civil/Concrete Works & Foundations.jpg',
    '/images/service-detail/Civil/Site Development & Grading.jpg',
  ],
  electrical: [
    '/images/service-detail/Electrical/HVMVLV Power Systems.jpg',
    '/images/service-detail/Electrical/Substation Design & Construction.jpg',
    '/images/service-detail/Electrical/Instrumentation & Control.jpg',
    '/images/service-detail/Electrical/Fire Detection & Suppression.jpg',
    '/images/service-detail/Electrical/Lighting & Earthing Systems.jpg',
    '/images/service-detail/Electrical/Cable Management & Trays.jpg',
  ],
  mechanical: [
    '/images/service-detail/Mechanical/Piping & Pipeline Systems.jpg',
    '/images/service-detail/Mechanical/HVAC & Ventilation.jpg',
    '/images/service-detail/Mechanical/Equipment Erection & Commissioning.jpg',
    '/images/service-detail/Mechanical/Pressure Vessels & Tanks.jpg',
    '/images/service-detail/Mechanical/Insulation & Painting.jpg',
    '/images/service-detail/Mechanical/Rotating Equipment.jpg',
  ],
};