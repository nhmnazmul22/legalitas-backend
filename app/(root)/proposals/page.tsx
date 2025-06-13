"use client";

import { useEffect, useState } from "react";
import api from "@/lib/config/axios";
import { RequestedProposal } from "@/types";
import { ProposalCard } from "@/components/ProposalCard";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<RequestedProposal[]>([]);

  const fetchProposals = async () => {
    const res = await api.get("/api/proposals/request-proposal");
    const datas: RequestedProposal[] = res.data.data;
    setProposals(datas);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permintaan Proposal</h1>
        <p className="text-muted-foreground">
          Kelola semua permintaan proposal dari klien
        </p>
      </div>

      <div className="grid gap-6">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal._id}
              id={proposal._id}
              clientName={proposal.clientName}
              clientEmail={proposal.clientEmail}
              clientWhatsAppNumber={proposal.clientWhatsAppNumber}
              voucherCode={proposal.voucherCode}
              status={proposal.status}
              createdAt={proposal.createdAt}
              proposalDetails={proposal.proposalDetails}
            />
          ))
        ) : (
          <SkeletonCard />
        )}
      </div>
    </div>
  );
}
