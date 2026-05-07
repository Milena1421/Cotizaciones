import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { Quote, Opportunity, QuoteStatus, OpportunityStatus } from '../types';

const QUOTES_PATH = 'quotes';
const OPPORTUNITIES_PATH = 'opportunities';

export const quoteService = {
  async createQuote(quoteData: Omit<Quote, 'id' | 'ownerId' | 'createdAt' | 'status'>) {
    try {
      const docRef = await addDoc(collection(db, QUOTES_PATH), {
        ...quoteData,
        status: 'pendiente',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, QUOTES_PATH);
    }
  },

  async updateQuoteStatus(quoteId: string, status: QuoteStatus) {
    const docRef = doc(db, QUOTES_PATH, quoteId);
    try {
      await updateDoc(docRef, { 
        status,
        updatedAt: serverTimestamp()
      });

      // If status is 'enviada', ensure an opportunity exists
      if (status === 'enviada') {
        await opportunityService.ensureOpportunityForQuote(quoteId);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${QUOTES_PATH}/${quoteId}`);
    }
  },

  subscribeToQuotes(callback: (quotes: Quote[]) => void) {
    const q = query(
      collection(db, QUOTES_PATH),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
      callback(quotes);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, QUOTES_PATH);
    });
  }
};

export const opportunityService = {
  async ensureOpportunityForQuote(quoteId: string) {
    try {
      const q = query(
        collection(db, OPPORTUNITIES_PATH),
        where('quoteId', '==', quoteId),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(collection(db, OPPORTUNITIES_PATH), {
          quoteId,
          status: 'seguimiento',
          lastContactAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, OPPORTUNITIES_PATH);
    }
  },

  subscribeToOpportunities(callback: (opportunities: Opportunity[]) => void) {
    const q = query(
      collection(db, OPPORTUNITIES_PATH),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const opportunities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
      callback(opportunities);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, OPPORTUNITIES_PATH);
    });
  },

  async updateOpportunityStatus(oppId: string, status: OpportunityStatus) {
    const docRef = doc(db, OPPORTUNITIES_PATH, oppId);
    try {
      await updateDoc(docRef, { 
        status,
        lastContactAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${OPPORTUNITIES_PATH}/${oppId}`);
    }
  }
};
