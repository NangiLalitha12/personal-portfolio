
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  education: Education[];
  skills: string[];
}

interface PortfolioContextType {
  portfolioData: PortfolioData;
  updatePortfolioData: (data: Partial<PortfolioData>) => Promise<void>;
  loading: boolean;
}

const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'Passionate developer creating amazing web experiences.',
    email: 'your.email@example.com',
    phone: '+1234567890',
    location: 'Your City, Country',
    profileImage: ''
  },
  projects: [],
  education: [],
  skills: []
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioData = async () => {
    try {
      const docRef = doc(db, 'portfolio', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPortfolioData({ ...defaultPortfolioData, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioData = async (data: Partial<PortfolioData>) => {
    try {
      const updatedData = { ...portfolioData, ...data };
      const docRef = doc(db, 'portfolio', 'main');
      await setDoc(docRef, updatedData, { merge: true });
      setPortfolioData(updatedData);
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, updatePortfolioData, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};
