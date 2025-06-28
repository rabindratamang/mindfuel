from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma as ch
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_openai import ChatOpenAI
from langchain_community.tools import tool

# Load PDFs
pdf_files = ["pdfs/27_Meditation_Techniques.pdf", "pdfs/how-to-meditate.pdf"]
all_documents = []
for pdf_file in pdf_files:
    loader = PyPDFLoader(pdf_file)
    docs = loader.load()
    all_documents.extend(docs)
documents = all_documents
print(f"Loaded {len(documents)} documents from {len(pdf_files)} PDFs.")

# Split text
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(documents)
print(f"Split into {len(texts)} chunks.")

# Embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

# Create & persist vectorstore
persist_directory = "chroma_db"
db = ch.from_documents(
    documents=texts,
    embedding=embeddings,
    persist_directory=None
)

# Create retriever
retriever = db.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# Prompt Template
custom_prompt_template = """
Use ONLY the pieces of information provided in the context to answer the user's question.
If the answer is not present in the context, explicitly return: I don't know.
Do NOT try to make up an answer or use outside knowledge.
Question: {question}
Context: {context}
Answer:
"""
prompt = ChatPromptTemplate.from_template(custom_prompt_template)
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

# RAG Chain
rag_chain = (
    {
        "context": RunnableLambda(lambda x: retriever.invoke(x["question"])),
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

# Tool definition
@tool
def rag_tool(question: str) -> str:
    """
    Answers a question using a retrieval-augmented generation (RAG) approach.
    Retrieves relevant documents from a vector store and uses an LLM to generate the final answer.
    """
    return rag_chain.invoke({"question": question})
