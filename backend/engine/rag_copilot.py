"""
GRC Co-Pilot RAG engine: a lightweight TF-IDF retrieval scorer over uploaded
bank policies plus a built-in NDPA 2023 / CBN Risk-Based Cybersecurity
Framework clause corpus. Given a natural-language audit query, it returns the
top matching regulatory/policy clauses ranked by cosine similarity.
"""
import os
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

STOPWORDS = {
    "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with",
    "is", "are", "be", "shall", "that", "this", "by", "at", "as", "it",
    "from", "we", "do", "does", "what", "how", "when", "should", "must",
    "i", "you", "our", "their", "any", "all",
}


def compute_highlight_terms(question: str, clause_text: str) -> list:
    """Returns significant words shared between the query and a clause,
    used by the frontend to green-highlight the exact matching evidence."""
    question_words = {w for w in re.findall(r"[a-z]+", question.lower()) if w not in STOPWORDS and len(w) > 2}
    clause_words = re.findall(r"[A-Za-z]+", clause_text)
    seen = set()
    matches = []
    for word in clause_words:
        lowered = word.lower()
        if lowered in question_words and lowered not in seen:
            seen.add(lowered)
            matches.append(word)
    return matches

# Baseline regulatory clause corpus shipped with the engine. Uploaded policy
# documents are appended to this corpus at query time.
BASELINE_CLAUSES = [
    {
        "source": "NDPA 2023",
        "clause": "Section 14(b)",
        "text": "A data controller or data processor shall retain personal data only for the period necessary to "
                "achieve the purpose for which it was collected, unless a longer retention period is required by law.",
        "framework": "ndpa",
    },
    {
        "source": "NDPA 2023",
        "clause": "Section 24",
        "text": "A data controller shall implement appropriate technical and organizational measures to ensure a "
                "level of security appropriate to the risk, including encryption and pseudonymization of personal data.",
        "framework": "ndpa",
    },
    {
        "source": "NDPA 2023",
        "clause": "Section 32",
        "text": "In the event of a personal data breach, the data controller shall notify the Commission within 72 hours "
                "of becoming aware of the breach, where feasible.",
        "framework": "ndpa",
    },
    {
        "source": "NDPA 2023",
        "clause": "Section 28",
        "text": "Personal data shall not be transferred outside Nigeria unless the recipient country ensures an "
                "adequate level of data protection or appropriate safeguards are in place.",
        "framework": "ndpa",
    },
    {
        "source": "CBN Risk-Based Cybersecurity Framework",
        "clause": "Section 3.1",
        "text": "Financial institutions shall establish a board-approved cybersecurity policy reviewed at least "
                "annually, with clear ownership of cybersecurity risk at executive level.",
        "framework": "cbn",
    },
    {
        "source": "CBN Risk-Based Cybersecurity Framework",
        "clause": "Section 4.2",
        "text": "Institutions shall conduct a cybersecurity risk assessment at least annually and maintain an "
                "inventory of critical information assets and their associated risk ratings.",
        "framework": "cbn",
    },
    {
        "source": "CBN Risk-Based Cybersecurity Framework",
        "clause": "Section 5.4",
        "text": "Institutions shall implement multi-factor authentication for all privileged and remote access "
                "to critical systems and maintain logs of all administrative activity for at least one year.",
        "framework": "cbn",
    },
    {
        "source": "CBN Risk-Based Cybersecurity Framework",
        "clause": "Section 6.1",
        "text": "Institutions shall report significant cyber incidents to the CBN within 24 hours of detection and "
                "submit a full incident report within 2 weeks of resolution.",
        "framework": "cbn",
    },
    {
        "source": "CBN Risk-Based Cybersecurity Framework",
        "clause": "Section 7.3",
        "text": "Institutions shall engage in third-party vendor risk assessments before onboarding any service "
                "provider with access to customer data or critical infrastructure.",
        "framework": "cbn",
    },
]

# Per-framework benchmark: total control count each framework is scored against
# on the Compliance Scoreboard, independent of how many sample clauses are
# authored below for gap-detection. The framework provides the benchmark size;
# uploaded policies determine how much of it is actually covered.
FRAMEWORK_META = {
    "iso27001": {"name": "ISO 27001", "total_controls": 163},
    "gdpr": {"name": "GDPR", "total_controls": 85},
    "soc2": {"name": "SOC 2 Type II", "total_controls": 120},
    "nist_csf": {"name": "NIST CSF", "total_controls": 82},
    "pcidss": {"name": "PCI-DSS", "total_controls": 78},
    "ndpr": {"name": "NDPR", "total_controls": 70},
}

# Representative baseline clauses per framework, used the same way the
# NDPA/CBN baseline above is: uploaded policies are TF-IDF-matched against
# these to compute coverage.
FRAMEWORK_BASELINE_CLAUSES = [
    {
        "source": "ISO 27001", "clause": "A.5.1", "framework": "iso27001",
        "text": "The organization shall define, approve, and communicate a set of information security "
                "policies, reviewed at planned intervals or when significant changes occur.",
    },
    {
        "source": "ISO 27001", "clause": "A.8.1", "framework": "iso27001",
        "text": "Information assets associated with information and information processing facilities "
                "shall be identified, and an inventory of these assets shall be maintained.",
    },
    {
        "source": "ISO 27001", "clause": "A.9.2", "framework": "iso27001",
        "text": "A formal user access provisioning process shall be implemented to assign or revoke "
                "access rights for all user types to all systems and services.",
    },
    {
        "source": "ISO 27001", "clause": "A.12.6", "framework": "iso27001",
        "text": "Information about technical vulnerabilities of information systems shall be obtained "
                "in a timely fashion, and the organization's exposure to such vulnerabilities evaluated.",
    },
    {
        "source": "GDPR", "clause": "Article 5", "framework": "gdpr",
        "text": "Personal data shall be processed lawfully, fairly, and in a transparent manner, and "
                "collected for specified, explicit, and legitimate purposes only.",
    },
    {
        "source": "GDPR", "clause": "Article 17", "framework": "gdpr",
        "text": "The data subject shall have the right to obtain erasure of personal data concerning "
                "them without undue delay where the data is no longer necessary for its original purpose.",
    },
    {
        "source": "GDPR", "clause": "Article 32", "framework": "gdpr",
        "text": "The controller and processor shall implement appropriate technical and organizational "
                "measures to ensure a level of security appropriate to the risk, including encryption.",
    },
    {
        "source": "GDPR", "clause": "Article 33", "framework": "gdpr",
        "text": "In the case of a personal data breach, the controller shall notify the competent "
                "supervisory authority without undue delay and, where feasible, within 72 hours.",
    },
    {
        "source": "SOC 2", "clause": "CC6.1", "framework": "soc2",
        "text": "The entity implements logical access security software, infrastructure, and "
                "architectures over protected information assets to protect them from security events.",
    },
    {
        "source": "SOC 2", "clause": "CC7.2", "framework": "soc2",
        "text": "The entity monitors system components and the operation of controls to detect "
                "anomalies indicative of security events and evaluates them to determine impact.",
    },
    {
        "source": "SOC 2", "clause": "CC8.1", "framework": "soc2",
        "text": "The entity authorizes, designs, develops, configures, documents, tests, approves, and "
                "implements changes to infrastructure, data, software, and procedures.",
    },
    {
        "source": "SOC 2", "clause": "A1.2", "framework": "soc2",
        "text": "The entity authorizes, designs, develops, and implements environmental protections, "
                "software, data backup processes, and recovery infrastructure to meet availability commitments.",
    },
    {
        "source": "NIST CSF", "clause": "ID.AM", "framework": "nist_csf",
        "text": "Physical devices, systems, software platforms, and applications within the "
                "organization shall be inventoried and managed consistent with their relative importance.",
    },
    {
        "source": "NIST CSF", "clause": "PR.AC", "framework": "nist_csf",
        "text": "Access to physical and logical assets and associated facilities shall be limited to "
                "authorized users, processes, and devices, and managed consistent with assessed risk.",
    },
    {
        "source": "NIST CSF", "clause": "DE.CM", "framework": "nist_csf",
        "text": "The information system and assets shall be monitored to identify cybersecurity events "
                "and verify the effectiveness of protective measures.",
    },
    {
        "source": "NIST CSF", "clause": "RS.RP", "framework": "nist_csf",
        "text": "Response processes and procedures shall be executed and maintained to ensure timely "
                "response to detected cybersecurity incidents.",
    },
    {
        "source": "PCI-DSS", "clause": "Req 3", "framework": "pcidss",
        "text": "Stored cardholder data shall be protected using encryption, truncation, masking, or "
                "hashing, with cryptographic keys protected against disclosure and misuse.",
    },
    {
        "source": "PCI-DSS", "clause": "Req 8", "framework": "pcidss",
        "text": "All users shall be assigned a unique ID before allowing access to system components "
                "or cardholder data, and multi-factor authentication shall be implemented.",
    },
    {
        "source": "PCI-DSS", "clause": "Req 10", "framework": "pcidss",
        "text": "All access to network resources and cardholder data shall be tracked and monitored, "
                "with audit logs retained for at least one year.",
    },
    {
        "source": "PCI-DSS", "clause": "Req 11", "framework": "pcidss",
        "text": "Security systems and processes shall be tested regularly, including quarterly "
                "vulnerability scans and periodic penetration testing.",
    },
    {
        "source": "NDPR", "clause": "Article 2.1", "framework": "ndpr",
        "text": "Personal data shall be collected and processed in accordance with specific, "
                "legitimate, and lawful purposes consented to by the data subject.",
    },
    {
        "source": "NDPR", "clause": "Article 2.6", "framework": "ndpr",
        "text": "The data controller shall, within 72 hours of becoming aware of a data breach, "
                "notify the National Information Technology Development Agency.",
    },
    {
        "source": "NDPR", "clause": "Article 2.7", "framework": "ndpr",
        "text": "Every data controller shall conduct a data protection impact assessment prior to any "
                "processing operation likely to result in high risk to the rights of a data subject.",
    },
    {
        "source": "NDPR", "clause": "Article 3.1", "framework": "ndpr",
        "text": "A data controller shall not transfer personal data to a foreign country unless that "
                "country ensures an adequate level of protection for the data.",
    },
]


def extract_text_from_pdf(file_path: str) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        from PyPDF2 import PdfReader

    reader = PdfReader(file_path)
    pages_text = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages_text)


def extract_text_from_upload(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower().lstrip(".")
    if ext == "pdf":
        return extract_text_from_pdf(file_path)
    if ext in ("txt",):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    if ext == "docx":
        import docx

        doc = docx.Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)
    raise ValueError(f"Unsupported file extension: {ext}")


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list:
    words = text.split()
    if not words:
        return []
    chunks = []
    step = max(chunk_size - overlap, 1)
    for start in range(0, len(words), step):
        chunk_words = words[start:start + chunk_size]
        if chunk_words:
            chunks.append(" ".join(chunk_words))
        if start + chunk_size >= len(words):
            break
    return chunks


class GRCCoPilot:
    def __init__(self, uploaded_policies: list = None):
        self.uploaded_policies = uploaded_policies or []

    def register_uploaded_policy(self, filename: str, text: str, is_test_data: bool = False):
        for chunk in chunk_text(text):
            self.uploaded_policies.append({
                "source": filename,
                "clause": "Uploaded Policy",
                "text": chunk,
                "framework": "uploaded",
                "is_test_data": is_test_data,
            })

    def _corpus(self, framework: str = "all") -> list:
        corpus = BASELINE_CLAUSES + self.uploaded_policies
        if framework and framework != "all":
            corpus = [c for c in corpus if c["framework"] == framework or c["framework"] == "uploaded"]
        return corpus

    def detect_gaps(self, coverage_threshold: float = 0.12, include_test_data: bool = True,
                     framework: str = None) -> list:
        """
        For each baseline regulatory clause, checks whether any uploaded policy
        chunk substantively covers it (cosine similarity above threshold). Any
        baseline clause without adequate coverage is flagged as an AI-detected
        compliance gap for the GRC Management dashboard.

        `include_test_data=False` excludes fake/sample policies uploaded to
        exercise the scoreboard from a real compliance-gap calculation.

        `framework`, when set to one of `FRAMEWORK_META`'s keys, scopes the
        baseline to that framework's clause bank instead of the default
        NDPA/CBN baseline (`framework=None`, existing behavior).
        """
        baseline = (
            [c for c in FRAMEWORK_BASELINE_CLAUSES if c["framework"] == framework]
            if framework else BASELINE_CLAUSES
        )

        pool = self.uploaded_policies if include_test_data else [
            p for p in self.uploaded_policies if not p.get("is_test_data")
        ]
        if not pool:
            return [
                {
                    "source": clause["source"],
                    "clause": clause["clause"],
                    "text": clause["text"],
                    "framework": clause["framework"],
                    "best_coverage_score": 0.0,
                    "covered": False,
                }
                for clause in baseline
            ]

        policy_texts = [p["text"] for p in pool]
        baseline_texts = [c["text"] for c in baseline]
        vectorizer = TfidfVectorizer(lowercase=True, stop_words="english", ngram_range=(1, 2))
        matrix = vectorizer.fit_transform(baseline_texts + policy_texts)

        baseline_vectors = matrix[:len(baseline_texts)]
        policy_vectors = matrix[len(baseline_texts):]
        similarities = cosine_similarity(baseline_vectors, policy_vectors)

        gaps = []
        for clause, scores in zip(baseline, similarities):
            best_score = round(float(scores.max()), 4) if len(scores) else 0.0
            gaps.append({
                "source": clause["source"],
                "clause": clause["clause"],
                "text": clause["text"],
                "framework": clause["framework"],
                "best_coverage_score": best_score,
                "covered": best_score >= coverage_threshold,
            })
        return gaps

    def compliance_score(self, coverage_threshold: float = 0.12, framework: str = None) -> dict:
        """Rolls detect_gaps() up into a single compliance scoreboard score:
        percentage of baseline regulatory clauses adequately covered by the
        organisation's uploaded (non-test) policies."""
        gaps = self.detect_gaps(coverage_threshold=coverage_threshold, include_test_data=False,
                                 framework=framework)
        total = len(gaps)
        covered = sum(1 for g in gaps if g["covered"])
        uncovered = total - covered
        return {
            "score_pct": round((covered / total) * 100, 1) if total else 0.0,
            "covered": covered,
            "uncovered": uncovered,
            "total": total,
        }

    def all_framework_scores(self, coverage_threshold: float = 0.12) -> list:
        """
        Compliance Scoreboard per-framework breakdown: for each framework in
        FRAMEWORK_META, computes real coverage (policies determine the score)
        against that framework's fixed benchmark control count (the framework
        provides the benchmark).
        """
        results = []
        for key, meta in FRAMEWORK_META.items():
            score = self.compliance_score(coverage_threshold=coverage_threshold, framework=key)
            total_controls = meta["total_controls"]
            percent = score["score_pct"]
            controls_covered = round(total_controls * percent / 100)
            results.append({
                "key": key,
                "name": meta["name"],
                "percent": percent,
                "controls_covered": controls_covered,
                "total_controls": total_controls,
                "status": "Compliant" if percent >= 80 else "Partial",
            })
        return results

    def query(self, question: str, framework: str = "all", top_k: int = 5) -> list:
        corpus = self._corpus(framework)
        if not question or not question.strip() or not corpus:
            return []

        documents = [c["text"] for c in corpus]
        vectorizer = TfidfVectorizer(lowercase=True, stop_words="english", ngram_range=(1, 2))
        doc_matrix = vectorizer.fit_transform(documents + [question])

        query_vector = doc_matrix[-1]
        doc_vectors = doc_matrix[:-1]
        similarities = cosine_similarity(query_vector, doc_vectors)[0]

        ranked = sorted(zip(corpus, similarities), key=lambda pair: pair[1], reverse=True)
        results = []
        for clause, score in ranked[:top_k]:
            if score <= 0:
                continue
            results.append({
                "source": clause["source"],
                "clause": clause["clause"],
                "text": clause["text"],
                "framework": clause["framework"],
                "relevance_score": round(float(score), 4),
                "highlight_terms": compute_highlight_terms(question, clause["text"]),
            })
        return results


_copilot_instance = None


def get_copilot() -> GRCCoPilot:
    global _copilot_instance
    if _copilot_instance is None:
        _copilot_instance = GRCCoPilot()
    return _copilot_instance
