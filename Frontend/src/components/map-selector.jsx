"use client"

import { useState, useEffect, useRef } from "react"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

// Replacing missing components with basic implementations
const Input = ({ id, value, onChange, placeholder }) => (
  <input
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-md ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button = ({ type, className, onClick, disabled, children }) => (
  <button
    type={type}
    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

// Replacing lucide-react icons with basic SVGs for compatibility
const SearchIcon = () => (
  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707a1 1 0 001.414-1.414l-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin text-slate-400" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg className="text-slate-500 flex-shrink-0" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 2a5 5 0 110 10 5 5 0 010-10z"></path>
  </svg>
);

const SendIcon = () => (
  <svg className="mr-2 h-4 w-4" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
  </svg>
);

const Minimize2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const Maximize2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

// Fix for default marker icon in leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

// Add fullscreen control implementation
const FullscreenButton = ({ mapRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = mapRef.current;
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === mapRef.current ||
        document.webkitFullscreenElement === mapRef.current
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [mapRef]);

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullscreen ? <Minimize2 /> : <Maximize2 />}
    </button>
  );
};

export default function MapSelector({ onLocationSelect }) {
  const defaultCenter = [30.0444, 31.2357]
  const [position, setPosition] = useState(defaultCenter)
  const [address, setAddress] = useState(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [addressComponents, setAddressComponents] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  })

  // Initialize map
  useEffect(() => {
    // Early return if map is already initialized
    if (mapInstanceRef.current) return;

    // Early return if DOM element is not ready
    if (!mapRef.current) return;

    try {
      // Initialize the map
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Add initial marker
      markerRef.current = L.marker(defaultCenter, { icon: markerIcon }).addTo(map);

      // Add click handler
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
      });

      // Store map instance
      mapInstanceRef.current = map;

      // Update marker position when position changes
      if (position) {
        markerRef.current.setLatLng(position);
        map.flyTo(position, map.getZoom());
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };

    
  }, []);

  // Handle position changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !position) return;

    try {
      markerRef.current.setLatLng(position);
      mapInstanceRef.current.flyTo(position, mapInstanceRef.current.getZoom());
    } catch (error) {
      console.error('Error updating marker position:', error);
    }
  }, [position]);

  // Handle position change and fetch address
  useEffect(() => {
  if (position) {
    const fetchAddress = async () => {
      setIsLoadingAddress(true);
      const addressData = await getAddressFromCoordinates(position[0], position[1]);
      setAddress(addressData);

      if (addressData && addressData.address) {
        const addr = addressData.address;
        const locationDetails = {
          address1: addr.road || "",
          address2: addr.neighbourhood || "",
          city: addr.city || addr.town || addr.village || "",
          state: addr.state || "",
          zipCode: addr.postcode || "",
          country: addr.country || "",
          full_address: addressData.display_name || "",
          latitude: position[0],
          longitude: position[1]
        };

        // Send to parent
        if (typeof onLocationSelect === "function") {
          onLocationSelect(locationDetails);
        }

        // Optional: if you're managing internal state
        setAddressComponents({
          street: locationDetails.address1,
          city: locationDetails.city,
          state: locationDetails.state,
          country: addr.country || "",
          postalCode: locationDetails.zipCode
        });
      }

      setIsLoadingAddress(false);
    };

    fetchAddress();
  }
}, [position]);


  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim().length > 2) {
      setIsSearching(true)
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchLocations(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Handle search result selection
  const handleSelectLocation = (location) => {
    const newPosition = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
    setPosition(newPosition)
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle address form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    setIsSearching(true)
    const results = await searchByAddressComponents(addressComponents)
    setIsSearching(false)

    if (results && results.length > 0) {
      // Use the first result
      const location = results[0]
      const newPosition = [Number.parseFloat(location.lat), Number.parseFloat(location.lon)]
      setPosition(newPosition)
    }
  }

  // Handle address input changes
  const handleAddressChange = (field, value) => {
    setAddressComponents((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800">Location Selector</h1>
      <p className="text-slate-600">Click anywhere on the map to select a location or search for a place</p>

      {/* Search bar */}
      <div className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <SearchIcon />
            <Input
              type="text"
              placeholder="Search for a location..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && (
              <LoaderIcon />
            )}
          </div>
        </div>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 shadow-lg">
            <CardContent className="p-0">
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                    onClick={() => handleSelectLocation(result)}
                  >
                    <MapPinIcon />
                    <div className="truncate">
                      <span className="font-medium">{result.display_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Address input form */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Location Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={addressComponents.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="123 Main St"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressComponents.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Cairo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={addressComponents.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="Cairo Governorate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressComponents.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  placeholder="Egypt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal/Zip Code</Label>
                <Input
                  id="postalCode"
                  value={addressComponents.postalCode}
                  onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                  placeholder="11511"
                />
              </div>

              <div className="flex items-end">
                <Button type="button" className="w-full" disabled={isSearching} onClick={handleAddressSubmit}>
                  {isSearching ? <LoaderIcon /> : <SendIcon />}
                  Find Location
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map container */}
      <div className="h-[500px] w-full relative border rounded-lg overflow-hidden">
        <div ref={mapRef} className="h-full w-full" />
        <FullscreenButton mapRef={mapRef} />
      </div>

      {/* Selected location info */}
      {position && (
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Selected Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Coordinates</p>
                <p className="font-mono bg-slate-50 p-2 rounded text-sm">
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Address</p>
                {isLoadingAddress ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <LoaderIcon />
                    <span>Loading address...</span>
                  </div>
                ) : address ? (
                  <div className="bg-slate-50 p-2 rounded text-sm">
                    <p className="font-medium">{address.display_name}</p>
                  </div>
                ) : (
                  <p className="text-slate-600">Address not found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }
        
        .leaflet-control-zoom {
          margin-right: 10px !important;
          margin-bottom: 10px !important;
        }
        
        .leaflet-control-zoom a {
          background-color: white !important;
          color: #374151 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  )
}

// Reverse geocode to get address from coordinates with Arabic support
async function getAddressFromCoordinates(lat, lng) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/reverse-geocode?lat=${lat}&lon=${lng}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}


// Search for locations by name with Arabic support
async function searchLocations(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ar`,
      {
        headers: {
          "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
          "User-Agent": "LocationPickerApp/1.0",
        },
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching locations:", error)
    return []
  }
}

// Search for location by address components with Arabic support
async function searchByAddressComponents(addressComponents) {
  const { street, city, state, country, postalCode } = addressComponents

  // Build query string from available components
  const queryParts = []
  if (street) queryParts.push(street)
  if (city) queryParts.push(city)
  if (state) queryParts.push(state)
  if (country) queryParts.push(country)
  if (postalCode) queryParts.push(postalCode)

  const query = queryParts.join(", ")

  if (query.trim() === "") return []

  return searchLocations(query)
}
