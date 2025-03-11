export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			documents: {
				Row: {
					id: string;
					document: Json;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					document: Json;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					document?: Json;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
	};
}
